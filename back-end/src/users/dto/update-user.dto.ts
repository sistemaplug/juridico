import { $Enums } from '@prisma/client';
import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: $Enums.Role;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
