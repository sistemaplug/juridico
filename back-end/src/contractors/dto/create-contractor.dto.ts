import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContractorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_commercial: string;

  @IsNotEmpty()
  @IsString()
  phone_personal: string;
}
