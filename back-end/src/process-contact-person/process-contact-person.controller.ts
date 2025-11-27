import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProcessContactPersonService } from './process-contact-person.service';
import { CreateProcessContactPersonDto } from './dto/create-process-contact-person.dto';
import { UpdateProcessContactPersonDto } from './dto/update-process-contact-person.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('process-contact-person')
export class ProcessContactPersonController {
  constructor(private readonly service: ProcessContactPersonService) {}

  @Post('register')
  async create(
    @Body() createProcessContactPersonDto: CreateProcessContactPersonDto,
  ) {
    return await this.service.create(createProcessContactPersonDto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get('by-contractor/:contractorId')
  async findByContractor(@Param('contractorId') contractorId: string) {
    return this.service.findByContractor(contractorId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProcessContactPersonDto: UpdateProcessContactPersonDto,
  ) {
    return await this.service.update(id, updateProcessContactPersonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
