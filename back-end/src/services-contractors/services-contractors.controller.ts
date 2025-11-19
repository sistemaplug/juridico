import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ServicesContractorsService } from './services-contractors.service';
import { CreateServicesContractorDto } from './dto/create-services-contractor.dto';
import { UpdateServicesContractorDto } from './dto/update-services-contractor.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('services')
export class ServicesContractorsController {
  constructor(private readonly service: ServicesContractorsService) {}

  @Post('register')
  async create(
    @Body() createServicesContractorDto: CreateServicesContractorDto,
  ) {
    return await this.service.create(createServicesContractorDto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServicesContractorDto: UpdateServicesContractorDto,
  ) {
    return await this.service.update(id, updateServicesContractorDto);
  }

  @Patch(':id/inactivate')
  async deactivate(@Param('id') id: string) {
    return await this.service.deactivate(id);
  }
}
