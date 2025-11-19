import { Injectable } from '@nestjs/common';
import { AddressesRepository } from './repositories/addresses.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly repository: AddressesRepository) {}

  async create(dto: CreateAddressDto) {
    return this.repository.create(dto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, dto: UpdateAddressDto) {
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
