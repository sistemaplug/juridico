import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePersonDto {
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
}
