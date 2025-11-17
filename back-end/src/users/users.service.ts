import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.repository.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async updateUserProfileAndPassword(
    userId: string,
    updateUserDto: UpdateUserDto,
  ) {
    return this.repository.updateUserProfileAndPassword(userId, updateUserDto);
  }

  async updateUserPasswordAsAdmin(
    targetUserId: string,
    newPasswordInput: string | { new_password?: string; newPassword?: string },
  ) {
    // Aceita tanto uma string quanto um objeto
    const newPassword =
      typeof newPasswordInput === 'string'
        ? newPasswordInput
        : newPasswordInput?.new_password || newPasswordInput?.newPassword;

    if (!newPassword) {
      throw new BadRequestException('A nova senha não foi informada.');
    }

    const errors: string[] = [];

    if (newPassword.length < 8) {
      errors.push('A senha deve ter no mínimo 8 caracteres.');
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula.');
    }
    if (!/[a-z]/.test(newPassword)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula.');
    }
    if (!/[0-9]/.test(newPassword)) {
      errors.push('A senha deve conter pelo menos um número.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      errors.push('A senha deve conter pelo menos um caractere especial.');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('\n'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.repository.update(targetUserId, { password: hashedPassword });
  }
}
