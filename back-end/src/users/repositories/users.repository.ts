import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new HttpException('Email already exists', 400);
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new HttpException('E-mail already registered', 401);
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: dto.role,
      },
    });

    // Remove o campo 'password' antes de retornar
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserEntity;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    await this.findById(id);

    return await this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async updateUserProfileAndPassword(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { password, ...restOfUpdates } = updateUserDto;

    let hashedPassword: string | undefined = undefined;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateData = {
      ...restOfUpdates,
      ...(hashedPassword && { password: hashedPassword }),
    };

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
