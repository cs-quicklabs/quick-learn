import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class ActivateRoadmapDto {
  @ApiProperty({
    description: 'Roadmap ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Active status of roadmap',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
