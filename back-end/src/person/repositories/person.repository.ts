import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EncryptionService } from 'src/common/encryption/encryption.service';
import { CreatePersonDto } from '../dto/create-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';
import { PersonEntity } from '../entities/person.entity';

@Injectable()
export class PersonRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  private encryptSensitiveFields(dto: any) {
    if (dto.cpf) dto.cpf = this.encryption.encrypt(dto.cpf);
    if (dto.cnpj) dto.cnpj = this.encryption.encrypt(dto.cnpj);
    return dto;
  }

  private decryptSensitiveFields(person: any) {
    if (person?.cpf) person.cpf = this.encryption.decrypt(person.cpf);
    if (person?.cnpj) person.cnpj = this.encryption.decrypt(person.cnpj);
    return person;
  }

  async create(dto: CreatePersonDto): Promise<PersonEntity> {
    const encryptedDto = this.encryptSensitiveFields(dto);

    const person = await this.prisma.person.create({
      data: encryptedDto,
    });

    return this.decryptSensitiveFields(person);
  }

  async findAll(): Promise<PersonEntity[]> {
    const list = await this.prisma.person.findMany({
      include: {
        addresses: true,
        contractors: true,
        process_contacts: true,
        requirers: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((p) => this.decryptSensitiveFields(p));
  }

  async findAllActive(): Promise<PersonEntity[]> {
    const list = await this.prisma.person.findMany({
      where: { is_active: true },
      include: {
        addresses: true,
        contractors: true,
        process_contacts: true,
        requirers: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((p) => this.decryptSensitiveFields(p));
  }

  async findAllInactive(): Promise<PersonEntity[]> {
    const list = await this.prisma.person.findMany({
      where: { is_active: false },
      include: {
        addresses: true,
        contractors: true,
        process_contacts: true,
        requirers: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return list.map((p) => this.decryptSensitiveFields(p));
  }

  async findById(id: string): Promise<PersonEntity> {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        addresses: true,
        contractors: true,
        process_contacts: true,
        requirers: true,
      },
    });

    if (!person) {
      throw new HttpException('Person not found', 404);
    }

    return this.decryptSensitiveFields(person);
  }

  async update(id: string, dto: UpdatePersonDto): Promise<PersonEntity> {
    await this.findById(id);

    const encryptedDto = this.encryptSensitiveFields(dto);

    const updated = await this.prisma.person.update({
      where: { id },
      data: encryptedDto,
      include: {
        addresses: true,
        contractors: true,
        process_contacts: true,
        requirers: true,
      },
    });

    return this.decryptSensitiveFields(updated);
  }

  async deactivate(id: string): Promise<PersonEntity> {
    await this.findById(id);

    return await this.prisma.person.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
