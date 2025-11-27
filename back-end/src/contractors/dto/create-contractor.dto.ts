import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContractorDto {
  @IsNotEmpty()
  @IsString()
  person_id: string;
}
