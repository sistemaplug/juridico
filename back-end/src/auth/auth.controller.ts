import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login-auth.dto';
import { uploadAvatar } from 'src/services/supabase/uploadAvatar';
import { UpdateOwnPasswordDto } from './dto/update-own-password.dto';

@Controller('users/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password,  } = loginDto;
    return this.service.login(email, password, );
  }

  @Post('block-email')
  async blockUserByEmail(@Body() body: { email: string }) {
    return this.service.blockUserByEmail(body.email);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const profile = await this.service.getProfile(req.user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    return await this.service.updateProfile(req.user.id, body);
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatarFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const url = await uploadAvatar(file, userId);
    await this.service.updateAvatar(userId, url);
    return { url };
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  async updateOwnPassword(@Req() req, @Body() dto: UpdateOwnPasswordDto) {
    return this.service.updateOwnPassword(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.id;
    return await this.service.logout(userId);
  }
}
