import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressesRepository } from './repositories/addresses.repository';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, PrismaService, AddressesRepository],
})
export class AddressesModule {}
