import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicesContractorDto } from '../dto/create-services-contractor.dto';
import { ServicesContractorEntity } from '../entities/services-contractor.entity';
import { UpdateServicesContractorDto } from '../dto/update-services-contractor.dto';

@Injectable()
export class ServicesContractorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateServicesContractorDto,
  ): Promise<ServicesContractorEntity> {
    return await this.prisma.service.create({ data: dto });
  }

  async findAll(): Promise<ServicesContractorEntity[]> {
    return await this.prisma.service.findMany({
      orderBy: { created_at: 'asc' },
      include: { contractor: true, trello_links: true },
    });
  }

  async findById(id: string): Promise<ServicesContractorEntity> {
    const service = await this.prisma.service.findFirst({
      where: { id },
      include: { contractor: true, trello_links: true },
    });

    if (!service) {
      throw new HttpException('Service not found', 404);
    }

    return service;
  }

  async update(
    id: string,
    dto: UpdateServicesContractorDto,
  ): Promise<ServicesContractorEntity> {
    await this.findById(id);

    return await this.prisma.service.update({
      where: { id },
      data: dto,
      include: { contractor: true, trello_links: true },
    });
  }

  async deactivate(id: string): Promise<ServicesContractorEntity> {
    await this.findById(id);

    return await this.prisma.service.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
