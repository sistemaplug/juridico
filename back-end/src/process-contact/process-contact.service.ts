import { Injectable } from '@nestjs/common';
import { CreateProcessContactDto } from './dto/create-process-contact.dto';
import { UpdateProcessContactDto } from './dto/update-process-contact.dto';
import { ProcessContactRepository } from './repositories/process-contact.repository';

@Injectable()
export class ProcessContactService {
  constructor(private readonly repository: ProcessContactRepository) {}

  async create(dto: CreateProcessContactDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    return await this.repository.findById(id);
  }

  async update(id: string, dto: UpdateProcessContactDto) {
    return await this.repository.update(id, dto);
  }

  async deactivate(id: string) {
    return await this.repository.deactivate(id);
  }
}
