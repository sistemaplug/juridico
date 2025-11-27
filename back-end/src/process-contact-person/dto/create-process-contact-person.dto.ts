import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProcessContactPersonDto {
  @IsNotEmpty()
  @IsString()
  person_id: string;

  @IsNotEmpty()
  @IsString()
  contractor_id: string;
}
