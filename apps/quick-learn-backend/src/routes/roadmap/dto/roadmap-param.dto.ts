import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RoadmapParamDto {
  @ApiProperty({
    name: 'id',
    description: 'Roadmap id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiPropertyOptional({
    name: 'courseId',
    description: 'Course ID associated with the roadmap',
    required: false,
  })
  @IsOptional()
  @IsString()
  courseId?: string | number;

  @ApiPropertyOptional({
    name: 'archived',
    description: 'Flag to indicate if the roadmap is archived (true/false)',
    required: false,
  })
  @IsOptional()
  @IsString()
  archived?: string;
}
