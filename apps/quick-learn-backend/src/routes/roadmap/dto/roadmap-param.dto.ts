import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoadmapParamDto {
  @ApiProperty({
    name: 'id',
    description: 'Roadmap id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
