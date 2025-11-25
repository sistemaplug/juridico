import { IsOptional, IsString } from 'class-validator';

export class UpdateProcessContactDto {
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
  @IsString()
  contractor_id?: string;

  @IsOptional()
  @IsString()
  commercial_address_id?: string;

  @IsOptional()
  @IsString()
  residential_address_id?: string;
}
