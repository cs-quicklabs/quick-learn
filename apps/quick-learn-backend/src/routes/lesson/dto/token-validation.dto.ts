import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenValidationDto {
  @ApiProperty({
    name: 'token',
    required: true,
    type: String,
    description: 'validate lesson url using token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
