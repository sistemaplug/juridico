import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AuthGuard } from 'src/auth/auth.guard';

// @UseGuards(AuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Post('register')
  async create(@Body() createContractDto: CreateContractDto) {
    return await this.service.create(createContractDto);
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
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return await this.service.update(id, updateContractDto);
  }

  @Patch(':id/inactivate')
  async deactivate(@Param('id') id: string) {
    return await this.service.deactivate(id);
  }
}
