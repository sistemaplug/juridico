import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrelloLinkDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  observation: string;

  @IsNotEmpty()
  @IsString()
  service_id: string;
}
