import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoadmapCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Engineering' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  team_id: number;
}
