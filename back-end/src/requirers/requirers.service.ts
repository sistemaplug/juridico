import { Injectable } from '@nestjs/common';
import { CreateRequirerDto } from './dto/create-requirer.dto';
import { UpdateRequirerDto } from './dto/update-requirer.dto';
import { RequirersRepository } from './repositories/requirers.repository';

@Injectable()
export class RequirersService {
  constructor(private readonly repository: RequirersRepository) {}

  async create(dto: CreateRequirerDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findByContractor(contractorId: string) {
    return await this.repository.findByContractor(contractorId);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async update(id: string, dto: UpdateRequirerDto) {
    return await this.repository.update(id, dto);
  }

  async deactivate(id: string) {
    return await this.repository.deactivate(id);
  }
}
