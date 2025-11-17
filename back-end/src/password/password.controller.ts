import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersService } from 'src/users/users.service';

@UseGuards(AuthGuard)
@Controller('password')
export class PasswordController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UsersService,
  ) {}

  // Atualização manual de senha (sem senha atual)
  @Patch('update/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    try {
      await this.passwordService.updatePassword(id, dto);
      return { message: 'Senha atualizada com sucesso!' };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao atualizar senha.',
      );
    }
  }

  // Geração de senha aleatória para o admin
  @Patch('generate/:id')
  async generatePassword(@Param('id') id: string) {
    const newPassword = this.passwordService.generateRandomPassword();
    await this.passwordService.forceUpdatePassword(id, newPassword);

    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException('Usuário não encontrado.');

    // Não retorna a senha por segurança
    return {
      message: 'Senha gerada e atualizada com sucesso!',
    };
  }
}
