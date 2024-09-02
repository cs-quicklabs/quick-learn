import { ApiProperty } from '@nestjs/swagger';
import { lowerCaseTransformer } from '@src/common/transformers';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'johndoe@company.com' })
  @IsEmail()
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  email: string;
}
