import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateContractorDto {
  @IsOptional()
  @IsString()
  person_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
