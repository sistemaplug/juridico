import { Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { ContractorsRepository } from './repositories/contractors.repository';

@Injectable()
export class ContractorsService {
  constructor(private readonly repository: ContractorsRepository) {}

  async create(dto: CreateContractorDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    return await this.findById(id);
  }

  async update(id: string, dto: UpdateContractorDto) {
    return await this.repository.update(id, dto);
  }

  async deactivate(id: string) {
    return await this.repository.deactivate(id);
  }
}
