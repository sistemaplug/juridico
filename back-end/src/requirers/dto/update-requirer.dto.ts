import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRequirerDto {
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
  contractor_id?: string;

  @IsOptional()
  @IsString()
  address_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
