import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoadmapDto {
  @ApiProperty({ example: 'Roadmap name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Roadmap description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  roadmap_category_id: string;
}
