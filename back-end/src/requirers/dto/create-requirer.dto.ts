import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequirerDto {
  @IsNotEmpty()
  @IsString()
  contractor_id: string;

  @IsNotEmpty()
  @IsString()
  person_id: string;
}
