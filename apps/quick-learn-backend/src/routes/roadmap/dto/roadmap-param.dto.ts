import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RoadmapParamDto {
  @ApiProperty({
    name: 'id',
    description: 'Roadmap id',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class RoadmapQueryDto {
  @ApiPropertyOptional({
    name: 'courseId',
    description: 'Course ID associated with the roadmap',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    name: 'archived',
    description: 'Flag to indicate if the roadmap is archived (true/false)',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  archived?: string;
}
