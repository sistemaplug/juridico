import { IsOptional, IsString } from 'class-validator';

export class UpdateProcessContactPersonDto {
  @IsOptional()
  @IsString()
  person_id?: string;

  @IsOptional()
  @IsString()
  contractor_id?: string;
}
