import { $Enums } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateServicesContractorDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: $Enums.StatusService;

  @IsOptional()
  @IsString()
  contractor_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
