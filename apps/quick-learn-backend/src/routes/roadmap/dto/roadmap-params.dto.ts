import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class roadmapParamsDto {
  @ApiProperty({
    name: 'id',
    description: 'Roadmap ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
