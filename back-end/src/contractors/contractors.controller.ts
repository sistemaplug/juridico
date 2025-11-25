import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('contractors')
export class ContractorsController {
  constructor(private readonly service: ContractorsService) {}

  @Post('register')
  async create(@Body() createContractorDto: CreateContractorDto) {
    return await this.service.create(createContractorDto);
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
  async update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
  ) {
    return await this.service.update(id, updateContractorDto);
  }

  @Patch(':id/inactivate')
  async deactivate(@Param('id') id: string) {
    return await this.service.deactivate(id);
  }
}
