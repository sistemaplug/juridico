import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServicesContractorDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  status: $Enums.StatusService;

  @IsNotEmpty()
  @IsString()
  contractor_id: string;
}
