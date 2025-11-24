import { IsOptional, IsString } from 'class-validator';

export class UpdateTrelloLinkDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  service_id?: string;
}
