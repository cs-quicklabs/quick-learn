import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoadmapDto } from './create-roadmap.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {
  @ApiProperty({
    description: 'Active status of the roadmap',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
