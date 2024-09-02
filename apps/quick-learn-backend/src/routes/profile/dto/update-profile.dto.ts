import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Asish' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Dhawan' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'https:www.example.com' })
  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  profile_image: string;
}
