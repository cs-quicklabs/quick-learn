import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'resetToken' })
  @IsString()
  resetToken: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(32, { message: "Password must be less than 32 character" })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
