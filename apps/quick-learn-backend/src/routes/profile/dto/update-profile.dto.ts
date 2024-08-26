import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Asish' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Dhawan' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  profile_image: string;
}
