import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwtStrategy';
import { AuthService } from './auth.service';
import { ReCaptchaService } from './recaptchaService';
import { ConfigModule } from '@nestjs/config';
import { PasswordModule } from 'src/password/password.module';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    PasswordModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    PrismaService,
    JwtStrategy,
    ReCaptchaService,
    UsersRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
