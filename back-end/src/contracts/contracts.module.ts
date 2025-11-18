import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContractsRepository } from './repositories/cotracts.repository';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService, PrismaService, ContractsRepository],
})
export class ContractsModule {}
