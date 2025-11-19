import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRequirerDto {
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
  contractor_id: string;

  @IsNotEmpty()
  @IsString()
  address_id: string;
}
