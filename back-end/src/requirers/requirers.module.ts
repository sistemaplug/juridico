import { Module } from '@nestjs/common';
import { RequirersService } from './requirers.service';
import { RequirersController } from './requirers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequirersRepository } from './repositories/requirers.repository';
import { EncryptionService } from 'src/common/encryption/encryption.service';

@Module({
  controllers: [RequirersController],
  providers: [
    RequirersService,
    PrismaService,
    RequirersRepository,
    EncryptionService,
  ],
})
export class RequirersModule {}
