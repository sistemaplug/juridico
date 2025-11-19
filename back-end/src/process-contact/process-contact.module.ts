import { Module } from '@nestjs/common';
import { ProcessContactService } from './process-contact.service';
import { ProcessContactController } from './process-contact.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcessContactRepository } from './repositories/process-contact.repository';

@Module({
  controllers: [ProcessContactController],
  providers: [ProcessContactService, PrismaService, ProcessContactRepository],
})
export class ProcessContactModule {}
