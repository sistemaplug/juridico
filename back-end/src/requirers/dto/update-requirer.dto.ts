import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateRequirerDto {
  @IsOptional()
  @IsString()
  contractor_id?: string;

  @IsOptional()
  @IsString()
  person_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
