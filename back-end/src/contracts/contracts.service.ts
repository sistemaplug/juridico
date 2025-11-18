import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractsRepository } from './repositories/cotracts.repository';

@Injectable()
export class ContractsService {
  constructor(private readonly repostiroy: ContractsRepository) {}

  async create(dto: CreateContractDto) {
    return await this.repostiroy.create(dto);
  }

  async findAll() {
    return await this.repostiroy.findAll();
  }

  async findById(id: string) {
    return await this.repostiroy.findById(id);
  }

  async update(id: string, dto: UpdateContractDto) {
    return await this.repostiroy.update(id, dto);
  }

  async deactivate(id: string) {
    return await this.repostiroy.deactivate(id);
  }
}
