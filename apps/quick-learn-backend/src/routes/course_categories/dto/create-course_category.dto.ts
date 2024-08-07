import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Production Deployment' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  roadmap_id: number;
}
