import { Injectable } from '@nestjs/common';
import { PersonRepository } from './repositories/person.repository';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(private readonly repository: PersonRepository) {}

  async create(dto: CreatePersonDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findAllActive() {
    return await this.repository.findAllActive();
  }

  async findAllInactive() {
    return await this.repository.findAllInactive();
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async update(id: string, dto: UpdatePersonDto) {
    return await this.repository.update(id, dto);
  }

  async deactivate(id: string) {
    return await this.repository.deactivate(id);
  }
}
