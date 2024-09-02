import { ApiProperty } from '@nestjs/swagger';
import { lowerCaseTransformer } from '@src/common/transformers';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@yopmail.com', description: 'User email' })
  @IsEmail()
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: true, description: 'Remember me' })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
