import { ApiProperty } from '@nestjs/swagger';
import { UserTypeIdEnum } from '@quick-learn/shared';
import { lowerCaseTransformer } from '@src/common/transformers';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  last_name: string;

  @ApiProperty({ example: 'johndoe@company.com' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => {
    const transformed = parseInt(value, 10);
    return isNaN(transformed) ? value : transformed;
  })
  @IsEnum(UserTypeIdEnum)
  @IsNumber()
  @IsNotEmpty()
  user_type_id: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => {
    const transformed = parseInt(value, 10);
    return isNaN(transformed) ? value : transformed;
  })
  @IsNumber()
  @IsNotEmpty()
  skill_id: number;
}
