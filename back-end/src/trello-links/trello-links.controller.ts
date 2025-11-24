import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrelloLinksService } from './trello-links.service';
import { CreateTrelloLinkDto } from './dto/create-trello-link.dto';
import { UpdateTrelloLinkDto } from './dto/update-trello-link.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('trello-links')
export class TrelloLinksController {
  constructor(private readonly service: TrelloLinksService) {}

  @Post('register')
  async create(@Body() createTrelloLinkDto: CreateTrelloLinkDto) {
    return await this.service.create(createTrelloLinkDto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrelloLinkDto: UpdateTrelloLinkDto,
  ) {
    return await this.service.update(id, updateTrelloLinkDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.trelloLinksService.remove(+id);
  // }
}
