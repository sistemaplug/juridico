import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequirerDto } from '../dto/create-requirer.dto';
import { RequirerEntity } from '../entities/requirer.entity';
import { UpdateRequirerDto } from '../dto/update-requirer.dto';
import { EncryptionService } from 'src/common/encryption/encryption.service';

@Injectable()
export class RequirersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  private decrypt(record: any) {
    if (record?.person?.cpf) {
      record.person.cpf = this.encryption.decrypt(record.person.cpf);
    }
    if (record?.person?.cnpj) {
      record.person.cnpj = this.encryption.decrypt(record.person.cnpj);
    }
    return record;
  }

  async create(dto: CreateRequirerDto): Promise<RequirerEntity> {
    const created = await this.prisma.requirer.create({
      data: dto,
      include: {
        contractor: true,
        person: {
          include: { addresses: true },
        },
      },
    });

    return this.decrypt(created);
  }

  async findAll(): Promise<RequirerEntity[]> {
    const list = await this.prisma.requirer.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        contractor: true,
        person: {
          include: { addresses: true },
        },
      },
    });

    return list.map((r) => this.decrypt(r));
  }

  async findByContractor(contractorId: string) {
    const list = await this.prisma.requirer.findMany({
      where: { contractor_id: contractorId },
      include: {
        contractor: true,
        person: {
          include: { addresses: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return list.map((r) => this.decrypt(r));
  }

  async findById(id: string): Promise<RequirerEntity> {
    const requirer = await this.prisma.requirer.findUnique({
      where: { id },
      include: {
        contractor: true,
        person: {
          include: { addresses: true },
        },
      },
    });

    if (!requirer) {
      throw new HttpException('Requirer not found', 404);
    }

    return this.decrypt(requirer);
  }

  async update(id: string, dto: UpdateRequirerDto): Promise<RequirerEntity> {
    await this.findById(id);

    const updated = await this.prisma.requirer.update({
      where: { id },
      data: dto,
      include: {
        contractor: true,
        person: {
          include: { addresses: true },
        },
      },
    });

    return this.decrypt(updated);
  }

  async deactivate(id: string): Promise<RequirerEntity> {
    await this.findById(id);

    return await this.prisma.requirer.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
