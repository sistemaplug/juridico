import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ContractorsModule } from './contractors/contractors.module';
import { ContractsModule } from './contracts/contracts.module';
import { ProcessContactModule } from './process-contact/process-contact.module';
import { CepModule } from './cep/cep.module';
import { AddressesModule } from './addresses/addresses.module';
import { RequirersModule } from './requirers/requirers.module';
import { ServicesContractorsModule } from './services-contractors/services-contractors.module';
import { TrelloLinksModule } from './trello-links/trello-links.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ContractorsModule,
    ContractsModule,
    ProcessContactModule,
    CepModule,
    AddressesModule,
    RequirersModule,
    ServicesContractorsModule,
    TrelloLinksModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
