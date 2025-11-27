import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonRepository } from './repositories/person.repository';
import { EncryptionService } from 'src/common/encryption/encryption.service';

@Module({
  controllers: [PersonController],
  providers: [
    PersonService,
    PrismaService,
    PersonRepository,
    EncryptionService,
  ],
})
export class PersonModule {}
