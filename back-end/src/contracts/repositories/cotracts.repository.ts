import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContractDto } from '../dto/create-contract.dto';
import { ContractEntity } from '../entities/contract.entity';
import { UpdateContractDto } from '../dto/update-contract.dto';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContractDto): Promise<ContractEntity> {
    return await this.prisma.contract.create({
      data: dto,
      include: {
        contractor: true,
      },
    });
  }

  async findAll(): Promise<ContractEntity[]> {
    return await this.prisma.contract.findMany({
      include: {
        contractor: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByContractor(contractorId: string): Promise<ContractEntity | null> {
    return await this.prisma.contract.findFirst({
      where: { contractor_id: contractorId },
      include: { contractor: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string): Promise<ContractEntity> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        contractor: true,
      },
    });

    if (!contract) {
      throw new HttpException('Contract not found', 404);
    }

    return contract;
  }

  async update(id: string, dto: UpdateContractDto): Promise<ContractEntity> {
    await this.findById(id);

    return await this.prisma.contract.update({
      where: { id },
      data: dto,
      include: {
        contractor: true,
      },
    });
  }

  async deactivate(id: string): Promise<ContractEntity> {
    await this.findById(id);

    return await this.prisma.contract.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
