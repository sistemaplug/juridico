import { Module } from '@nestjs/common';
import { ProcessContactPersonService } from './process-contact-person.service';
import { ProcessContactPersonController } from './process-contact-person.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProcessContactPersonRepository } from './repositories/process-contact-person.repository';
import { EncryptionService } from 'src/common/encryption/encryption.service';

@Module({
  controllers: [ProcessContactPersonController],
  providers: [
    ProcessContactPersonService,
    PrismaService,
    ProcessContactPersonRepository,
    EncryptionService,
  ],
})
export class ProcessContactPersonModule {}
