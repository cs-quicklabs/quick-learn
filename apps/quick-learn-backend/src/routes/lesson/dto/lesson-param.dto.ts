import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LessonParamDto {
  @ApiProperty({
    name: 'id',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  id: string;
}
