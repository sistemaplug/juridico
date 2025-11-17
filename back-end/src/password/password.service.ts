import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordRepository } from './repositories/password.repository';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class PasswordService {
  constructor(private readonly passwordRepository: PasswordRepository) {}

  validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres.');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula.');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula.');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial.');
    }

    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um dígito numérico.');
    }

    return errors;
  }

  generateRandomPassword(): string {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '@#$%^&*';
    const all = upperCase + lowerCase + numbers + special;

    let password = '';
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    while (password.length < 12) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.passwordRepository.findUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const hashed = await this.hashPassword(dto.new_password);
    return this.passwordRepository.updatePassword(userId, hashed);
  }

  async forceUpdatePassword(userId: string, plainPassword: string) {
    const user = await this.passwordRepository.findUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const hashed = await this.hashPassword(plainPassword);
    return this.passwordRepository.updatePassword(userId, hashed);
  }
}
