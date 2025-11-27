import { Injectable } from '@nestjs/common';
import { CreateServicesContractorDto } from './dto/create-services-contractor.dto';
import { UpdateServicesContractorDto } from './dto/update-services-contractor.dto';
import { ServicesContractorsRepository } from './repositories/services-contractors.repository';

@Injectable()
export class ServicesContractorsService {
  constructor(private readonly repository: ServicesContractorsRepository) {}

  async create(dto: CreateServicesContractorDto) {
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

  async update(id: string, dto: UpdateServicesContractorDto) {
    return await this.repository.update(id, dto);
  }

  async deactivate(id: string) {
    return await this.repository.deactivate(id);
  }
}
