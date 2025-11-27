import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateContractDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  contract_date: Date;

  @IsNotEmpty()
  @IsString()
  contract_object: string;

  @IsNotEmpty()
  @IsString()
  service_type: string;

  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsString()
  frequency: string;

  @IsNotEmpty()
  @IsString()
  power: string;

  @IsNotEmpty()
  @IsString()
  contractor_id: string;
}
