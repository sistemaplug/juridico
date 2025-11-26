import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RequirersService } from './requirers.service';
import { CreateRequirerDto } from './dto/create-requirer.dto';
import { UpdateRequirerDto } from './dto/update-requirer.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('requirers')
export class RequirersController {
  constructor(private readonly service: RequirersService) {}

  @Post('register')
  async create(@Body() createRequirerDto: CreateRequirerDto) {
    return await this.service.create(createRequirerDto);
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
    @Body() updateRequirerDto: UpdateRequirerDto,
  ) {
    return await this.service.update(id, updateRequirerDto);
  }

  @Patch(':id/inactivate')
  async deactivate(@Param('id') id: string) {
    return await this.service.deactivate(id);
  }
}
