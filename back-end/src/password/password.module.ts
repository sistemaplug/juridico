import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { PasswordRepository } from './repositories/password.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [],
  controllers: [PasswordController],
  providers: [
    PrismaService,
    PasswordService,
    PasswordRepository,
    UsersService,
    UsersRepository,
  ],
  exports: [PasswordService, PasswordRepository],
})
export class PasswordModule {}
