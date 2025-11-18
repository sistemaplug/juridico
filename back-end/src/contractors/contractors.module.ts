import { Module } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { ContractorsController } from './contractors.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContractorsRepository } from './repositories/contractors.repository';
import { EncryptionService } from 'src/common/encryption/encryption.service';

@Module({
  controllers: [ContractorsController],
  providers: [
    ContractorsService,
    PrismaService,
    EncryptionService,
    ContractorsRepository,
  ],
})
export class ContractorsModule {}
