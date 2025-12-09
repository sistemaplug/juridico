import { Injectable } from '@nestjs/common';
import { CreateTrelloLinkDto } from './dto/create-trello-link.dto';
import { UpdateTrelloLinkDto } from './dto/update-trello-link.dto';
import { TrelloLinksRepository } from './repositories/trello-links.repository';

@Injectable()
export class TrelloLinksService {
  constructor(private readonly repository: TrelloLinksRepository) {}

  async create(dto: CreateTrelloLinkDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async update(id: string, dto: UpdateTrelloLinkDto) {
    return await this.repository.update(id, dto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
