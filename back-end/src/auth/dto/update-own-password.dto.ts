import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateOwnPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  new_password: string;
}
