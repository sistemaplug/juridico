import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProcessContactService } from './process-contact.service';
import { CreateProcessContactDto } from './dto/create-process-contact.dto';
import { UpdateProcessContactDto } from './dto/update-process-contact.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('process-contact')
export class ProcessContactController {
  constructor(private readonly service: ProcessContactService) {}

  @Post('register')
  async create(@Body() createProcessContactDto: CreateProcessContactDto) {
    return await this.service.create(createProcessContactDto);
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
    @Body() updateProcessContactDto: UpdateProcessContactDto,
  ) {
    return await this.service.update(id, updateProcessContactDto);
  }

  @Patch(':id/inactivate')
  async deactivate(@Param('id') id: string) {
    return await this.service.deactivate(id);
  }
}
