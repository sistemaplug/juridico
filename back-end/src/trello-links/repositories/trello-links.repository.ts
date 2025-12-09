import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrelloLinkDto } from '../dto/create-trello-link.dto';
import { TrelloLinkEntity } from '../entities/trello-link.entity';
import { UpdateTrelloLinkDto } from '../dto/update-trello-link.dto';

@Injectable()
export class TrelloLinksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrelloLinkDto): Promise<TrelloLinkEntity> {
    return await this.prisma.trelloLink.create({ data: dto });
  }

  async findAll(): Promise<TrelloLinkEntity[]> {
    return await this.prisma.trelloLink.findMany({
      orderBy: { created_at: 'asc' },
      include: { service: true },
    });
  }

  async findById(id: string): Promise<TrelloLinkEntity> {
    const trelloLink = await this.prisma.trelloLink.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!trelloLink) {
      throw new HttpException('Trello Link not found', 404);
    }

    return trelloLink;
  }

  async update(
    id: string,
    dto: UpdateTrelloLinkDto,
  ): Promise<TrelloLinkEntity> {
    await this.findById(id);

    return await this.prisma.trelloLink.update({
      where: { id },
      data: dto,
      include: { service: true },
    });
  }

  async remove(id: string): Promise<TrelloLinkEntity> {
    await this.findById(id);

    return await this.prisma.trelloLink.delete({ where: { id } });
  }
}
