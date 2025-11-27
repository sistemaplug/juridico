import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EncryptionService } from 'src/common/encryption/encryption.service';
import { CreateProcessContactPersonDto } from '../dto/create-process-contact-person.dto';
import { UpdateProcessContactPersonDto } from '../dto/update-process-contact-person.dto';
import { ProcessContactPersonEntity } from '../entities/process-contact-person.entity';

@Injectable()
export class ProcessContactPersonRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  private encryptSensitiveFields(dto: any) {
    if (dto.person?.cpf)
      dto.person.cpf = this.encryption.encrypt(dto.person.cpf);
    if (dto.person?.cnpj)
      dto.person.cnpj = this.encryption.encrypt(dto.person.cnpj);
    return dto;
  }

  private decryptSensitiveFields(record: any) {
    if (record?.person?.cpf)
      record.person.cpf = this.encryption.decrypt(record.person.cpf);
    if (record?.person?.cnpj)
      record.person.cnpj = this.encryption.decrypt(record.person.cnpj);
    return record;
  }

  async create(
    dto: CreateProcessContactPersonDto,
  ): Promise<ProcessContactPersonEntity> {
    const encryptedDto = this.encryptSensitiveFields(dto);

    const record = await this.prisma.processContactPerson.create({
      data: encryptedDto,
      include: {
        person: {
          include: {
            addresses: true,
          },
        },
        contractor: true,
      },
    });

    return this.decryptSensitiveFields(record);
  }

  async findAll(): Promise<ProcessContactPersonEntity[]> {
    const list = await this.prisma.processContactPerson.findMany({
      include: {
        person: {
          include: {
            addresses: true,
          },
        },
        contractor: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return list.map((item) => this.decryptSensitiveFields(item));
  }

  async findByContractor(contractorId: string) {
    const list = await this.prisma.processContactPerson.findMany({
      where: { contractor_id: contractorId },
      include: {
        person: {
          include: {
            addresses: true,
          },
        },
        contractor: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return list.map((item) => this.decryptSensitiveFields(item));
  }

  async findById(id: string): Promise<ProcessContactPersonEntity> {
    const record = await this.prisma.processContactPerson.findUnique({
      where: { id },
      include: {
        person: {
          include: {
            addresses: true,
          },
        },
        contractor: true,
      },
    });

    if (!record) {
      throw new HttpException('ProcessContactPerson not found', 404);
    }

    return this.decryptSensitiveFields(record);
  }

  async update(
    id: string,
    dto: UpdateProcessContactPersonDto,
  ): Promise<ProcessContactPersonEntity> {
    await this.findById(id);

    const encryptedDto = this.encryptSensitiveFields(dto);

    const updated = await this.prisma.processContactPerson.update({
      where: { id },
      data: encryptedDto,
      include: {
        person: {
          include: {
            addresses: true,
          },
        },
        contractor: true,
      },
    });

    return this.decryptSensitiveFields(updated);
  }

  async delete(id: string): Promise<ProcessContactPersonEntity> {
    await this.findById(id);

    return await this.prisma.processContactPerson.delete({
      where: { id },
    });
  }
}
