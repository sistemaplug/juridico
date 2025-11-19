import { Module } from '@nestjs/common';
import { ServicesContractorsService } from './services-contractors.service';
import { ServicesContractorsController } from './services-contractors.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicesContractorsRepository } from './repositories/services-contractors.repository';

@Module({
  controllers: [ServicesContractorsController],
  providers: [
    ServicesContractorsService,
    PrismaService,
    ServicesContractorsRepository,
  ],
})
export class ServicesContractorsModule {}
