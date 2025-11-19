import { Module } from '@nestjs/common';
import { RequirersService } from './requirers.service';
import { RequirersController } from './requirers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequirersRepository } from './repositories/requirers.repository';

@Module({
  controllers: [RequirersController],
  providers: [RequirersService, PrismaService, RequirersRepository],
})
export class RequirersModule {}
