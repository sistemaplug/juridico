import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequirerDto } from '../dto/create-requirer.dto';
import { RequirerEntity } from '../entities/requirer.entity';
import { UpdateRequirerDto } from '../dto/update-requirer.dto';

@Injectable()
export class RequirersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequirerDto): Promise<RequirerEntity> {
    return await this.prisma.requirer.create({ data: dto });
  }

  async findAll(): Promise<RequirerEntity[]> {
    return await this.prisma.requirer.findMany({
      orderBy: { created_at: 'asc' },
      include: { contractor: true, address: true },
    });
  }

  async findByContractor(contractorId: string) {
    return await this.prisma.requirer.findFirst({
      where: { contractor_id: contractorId },
      include: { address: true },
    });
  }

  async findById(id: string): Promise<RequirerEntity> {
    const requirer = await this.prisma.requirer.findUnique({
      where: { id },
      include: { contractor: true, address: true },
    });

    if (!requirer) {
      throw new HttpException('Requirer not found', 404);
    }

    return requirer;
  }

  async update(id: string, dto: UpdateRequirerDto): Promise<RequirerEntity> {
    await this.findById(id);

    return await this.prisma.requirer.update({
      where: { id },
      data: dto,
      include: { contractor: true, address: true },
    });
  }

  async deactivate(id: string): Promise<RequirerEntity> {
    await this.findById(id);

    return await this.prisma.requirer.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
