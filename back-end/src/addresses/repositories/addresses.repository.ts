import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressEntity } from '../entities/address.entity';

@Injectable()
export class AddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAddressDto): Promise<AddressEntity> {
    return await this.prisma.address.create({
      data: dto,
    });
  }

  async findAll(): Promise<AddressEntity[]> {
    return await this.prisma.address.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        person: true,
      },
    });
  }

  async findById(id: string): Promise<AddressEntity | null> {
    return await this.prisma.address.findUnique({
      where: { id },
      include: {
        person: true,
      },
    });
  }

  async update(id: string, dto: UpdateAddressDto): Promise<AddressEntity> {
    return await this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<AddressEntity> {
    return await this.prisma.address.delete({ where: { id } });
  }
}
