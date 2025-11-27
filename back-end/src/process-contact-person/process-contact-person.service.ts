import { Injectable, HttpException } from '@nestjs/common';
import { ProcessContactPersonRepository } from './repositories/process-contact-person.repository';
import { CreateProcessContactPersonDto } from './dto/create-process-contact-person.dto';
import { UpdateProcessContactPersonDto } from './dto/update-process-contact-person.dto';

@Injectable()
export class ProcessContactPersonService {
  constructor(private readonly repository: ProcessContactPersonRepository) {}

  async create(dto: CreateProcessContactPersonDto) {
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

  async update(id: string, dto: UpdateProcessContactPersonDto) {
    return await this.repository.update(id, dto);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
