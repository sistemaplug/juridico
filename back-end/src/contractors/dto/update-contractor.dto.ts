import { $Enums } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateContractorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone_commercial?: string;

  @IsOptional()
  @IsString()
  phone_personal?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  commercial_address_id?: string;

  @IsOptional()
  @IsString()
  residential_address_id?: string;
}
