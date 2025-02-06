import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoadmapParamsDto {
  @ApiProperty({
    name: 'id',
    description: 'Roadmap Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
