import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async findUserById(userId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId },
    });
  }
}
