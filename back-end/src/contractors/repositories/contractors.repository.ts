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

  private encryptSensitiveFields(dto: any) {
    if (dto.cpf) dto.cpf = this.encryption.encrypt(dto.cpf);
    if (dto.cnpj) dto.cnpj = this.encryption.encrypt(dto.cnpj);
    return dto;
  }

  private decryptSensitiveFields(contractor: any) {
    if (contractor?.cpf) {
      contractor.cpf = this.encryption.decrypt(contractor.cpf);
    }
    if (contractor?.cnpj) {
      contractor.cnpj = this.encryption.decrypt(contractor.cnpj);
    }
    return contractor;
  }

  async create(dto: CreateContractorDto): Promise<ContractorEntity> {
    const encryptedDto = this.encryptSensitiveFields(dto);

    return await this.prisma.contractor.create({ data: encryptedDto });
  }

  async findAll(): Promise<ContractorEntity[]> {
    const list = await this.prisma.contractor.findMany({
      include: {
        commercial_address: true,
        residential_address: true,
        contracts: true,
        requirers: true,
        services: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((c) => this.decryptSensitiveFields(c));
  }

  async findAllActive(): Promise<ContractorEntity[]> {
    const list = await this.prisma.contractor.findMany({
      where: { is_active: true },
      include: {
        commercial_address: true,
        residential_address: true,
        contracts: true,
        requirers: true,
        services: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((c) => this.decryptSensitiveFields(c));
  }

  async findAllInactive(): Promise<ContractorEntity[]> {
    const list = await this.prisma.contractor.findMany({
      where: { is_active: false },
      include: {
        commercial_address: true,
        residential_address: true,
        contracts: true,
        requirers: true,
        services: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((c) => this.decryptSensitiveFields(c));
  }

  async findById(id: string): Promise<ContractorEntity> {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
      include: {
        commercial_address: true,
        residential_address: true,
        contracts: true,
        requirers: true,
        services: true,
      },
    });

    if (!contractor) {
      throw new HttpException('Conctractor not found', 404);
    }

    return this.decryptSensitiveFields(contractor);
  }

  async update(
    id: string,
    dto: UpdateContractorDto,
  ): Promise<ContractorEntity> {
    await this.findById(id);

    const encryptedDto = this.encryptSensitiveFields(dto);

    return await this.prisma.contractor.update({
      where: { id },
      data: encryptedDto,
      include: {
        commercial_address: true,
        residential_address: true,
        contracts: true,
        requirers: true,
        services: true,
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
