import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'CS Warriors' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'https:www.example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logo?: string;
}
