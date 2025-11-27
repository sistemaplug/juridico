import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContractorDto } from '../dto/create-contractor.dto';
import { ContractorEntity } from '../entities/contractor.entity';
import { UpdateContractorDto } from '../dto/update-contractor.dto';
import { EncryptionService } from 'src/common/encryption/encryption.service';

@Injectable()
export class ContractorsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  private decryptSensitiveFields(contractor: any) {
    if (contractor?.person?.cpf) {
      contractor.person.cpf = this.encryption.decrypt(contractor.person.cpf);
    }
    if (contractor?.person?.cnpj) {
      contractor.person.cnpj = this.encryption.decrypt(contractor.person.cnpj);
    }
    return contractor;
  }

  async create(dto: CreateContractorDto): Promise<ContractorEntity> {
    return await this.prisma.contractor.create({
      data: {
        person_id: dto.person_id,
      },
    });
  }

  async findAll(): Promise<ContractorEntity[]> {
    const list = await this.prisma.contractor.findMany({
      include: {
        person: true,
        contracts: true,
        services: true,
        requirers: true,
        process_contacts: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((c) => this.decryptSensitiveFields(c));
  }

  async findAllActive(): Promise<ContractorEntity[]> {
    const list = await this.prisma.contractor.findMany({
      where: { is_active: true },
      include: {
        person: true,
        contracts: true,
        services: true,
        requirers: true,
        process_contacts: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((c) => this.decryptSensitiveFields(c));
  }

  async findAllInactive(): Promise<ContractorEntity[]> {
    const list = await this.prisma.contractor.findMany({
      where: { is_active: false },
      include: {
        person: true,
        contracts: true,
        services: true,
        requirers: true,
        process_contacts: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((c) => this.decryptSensitiveFields(c));
  }

  async findById(id: string): Promise<ContractorEntity> {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
      include: {
        person: true,
        contracts: true,
        services: true,
        requirers: true,
        process_contacts: true,
      },
    });

    if (!contractor) {
      throw new HttpException('Contractor not found', 404);
    }

    return contractor;
  }

  async update(
    id: string,
    dto: UpdateContractorDto,
  ): Promise<ContractorEntity> {
    await this.findById(id);

    return await this.prisma.contractor.update({
      where: { id },
      data: dto,
      include: {
        person: true,
        contracts: true,
        services: true,
        requirers: true,
        process_contacts: true,
      },
    });
  }

  async deactivate(id: string): Promise<ContractorEntity> {
    await this.findById(id);

    return await this.prisma.contractor.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
