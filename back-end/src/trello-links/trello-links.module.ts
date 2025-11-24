import { Module } from '@nestjs/common';
import { TrelloLinksService } from './trello-links.service';
import { TrelloLinksController } from './trello-links.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrelloLinksRepository } from './repositories/trello-links.repository';

@Module({
  controllers: [TrelloLinksController],
  providers: [TrelloLinksService, PrismaService, TrelloLinksRepository],
})
export class TrelloLinksModule {}
