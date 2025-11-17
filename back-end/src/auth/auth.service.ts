import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ReCaptchaService } from './recaptchaService';
import { UpdateOwnPasswordDto } from './dto/update-own-password.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { PasswordService } from 'src/password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recaptchaService: ReCaptchaService,
    private readonly jwtService: JwtService,
    private readonly repository: UsersRepository,
    private readonly password: PasswordService,
  ) {}

  async login(email: string, password: string, recaptchaToken) {
    // Verifica o reCAPTCHA antes de tudo
    await this.recaptchaService.verifyToken(recaptchaToken, 'login');

    // Procura o usuário
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não existir
    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas!');
    }

    // Se o usuário estiver bloqueado
    if (!user.is_active) {
      throw new UnauthorizedException(
        'Acesso bloqueado, entre em contato com o administrador.',
      );
    }

    // Compara senha
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais Inválidas!');
    }

    // Gera token JWT
    const payload = { email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });

    await this.prisma.token.create({
      data: {
        access_token: accessToken,
        user_id: user.id,
      },
    });

    return { accessToken };
  }

  async blockUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Evita expor se o email existe ou não
      return { message: 'OK' };
    }

    await this.prisma.user.update({
      where: { email },
      data: { is_active: false },
    });

    return { message: 'Usuário bloqueado com sucesso.' };
  }

  async getProfile(id: string) {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: {
        name: true,
        email: true,
        role: true,
        avatar_url: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: Partial<{
      name: string;
      email: string;
      avatar_url: string;
      salary: number;
      billing_day: number;
    }>,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User not found.', 404);
    }

    const avatarUrlAtual =
      data.avatar_url !== undefined && data.avatar_url !== ''
        ? data.avatar_url
        : user.avatar_url;

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? user.name,
        email: data.email ?? user.email,
        avatar_url: avatarUrlAtual,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar_url: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar_url: avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar_url: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      ...updatedUser,
    };
  }

  async updateOwnPassword(userId: string, dto: UpdateOwnPasswordDto) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Valida a senha nova
    const errors = this.password.validatePassword(dto.new_password);
    if (errors.length > 0) {
      throw new BadRequestException(errors.join('\n'));
    }

    // Impede repetir a mesma senha
    const isSame = await bcrypt.compare(dto.new_password, user.password);
    if (isSame) {
      throw new BadRequestException('A nova senha não pode ser igual à atual.');
    }

    // Criptografa e atualiza
    const hashed = await this.password.hashPassword(dto.new_password);

    await this.repository.update(userId, { password: hashed });

    return { message: 'Senha atualizada com sucesso!' };
  }

  async logout(userId: string) {
    await this.prisma.token.updateMany({
      where: {
        user_id: userId,
        is_revoked: false,
      },
      data: {
        is_revoked: true,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (isPasswordMatching) {
        return user;
      }
    }
    return null;
  }
}
