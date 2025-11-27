import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('persons')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post('register')
  async create(@Body() dto: CreatePersonDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get('active')
  async findAllActive() {
    return await this.service.findAllActive();
  }

  @Get('inactive')
  async findAllInactive() {
    return await this.service.findAllInactive();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return await this.service.update(id, dto);
  }

  @Patch(':id/inactivate')
  async deactivate(@Param('id') id: string) {
    return await this.service.deactivate(id);
  }
}
