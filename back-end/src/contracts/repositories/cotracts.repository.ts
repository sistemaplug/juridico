import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContractDto } from '../dto/create-contract.dto';
import { ContractEntity } from '../entities/contract.entity';
import { UpdateContractDto } from '../dto/update-contract.dto';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContractDto): Promise<ContractEntity> {
    return await this.prisma.contract.create({ data: dto });
  }

  async findAll(): Promise<ContractEntity[]> {
    return await this.prisma.contract.findMany();
  }

  async findByContractor(contractorId: string) {
    return await this.prisma.contract.findFirst({
      where: { contractor_id: contractorId },
    });
  }

  async findById(id: string): Promise<ContractEntity> {
    const contract = await this.prisma.contract.findUnique({ where: { id } });

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
