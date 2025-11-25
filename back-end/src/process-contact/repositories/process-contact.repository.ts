import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProcessContactDto } from '../dto/create-process-contact.dto';
import { ProcessContactEntity } from '../entities/process-contact.entity';
import { UpdateProcessContactDto } from '../dto/update-process-contact.dto';

@Injectable()
export class ProcessContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProcessContactDto): Promise<ProcessContactEntity> {
    return await this.prisma.processContact.create({ data: dto });
  }

  async findAll(): Promise<ProcessContactEntity[]> {
    return await this.prisma.processContact.findMany({
      orderBy: {
        created_at: 'asc',
      },
      include: { commercial_address: true, residential_address: true },
    });
  }

  async findByContractor(contractorId: string) {
    return await this.prisma.processContact.findFirst({
      where: { contractor_id: contractorId },
      include: {
        commercial_address: true,
        residential_address: true,
      },
    });
  }

  async findById(id: string): Promise<ProcessContactEntity> {
    const processContact = await this.prisma.processContact.findUnique({
      where: { id },
      include: { commercial_address: true, residential_address: true },
    });

    if (!processContact) {
      throw new HttpException('Process Contact not found', 404);
    }

    return processContact;
  }

  async update(
    id: string,
    dto: UpdateProcessContactDto,
  ): Promise<ProcessContactEntity> {
    await this.findById(id);

    return await this.prisma.processContact.update({
      where: { id },
      data: dto,
      include: { commercial_address: true, residential_address: true },
    });
  }

  async deactivate(id: string): Promise<ProcessContactEntity> {
    await this.findById(id);

    return await this.prisma.processContact.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
