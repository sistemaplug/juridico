import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.service.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.service.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/password/update')
  async updatePasswordAsAdmin(
    @Param('id') id: string,
    @Body('password') newPassword: string,
  ) {
    return await this.service.updateUserPasswordAsAdmin(id, newPassword);
  }
}
