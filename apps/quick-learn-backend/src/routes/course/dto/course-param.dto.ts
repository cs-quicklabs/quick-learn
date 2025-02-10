import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CourseParamDto {
  @ApiProperty({
    name: 'id',
    description: 'course id',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  id: string;
}
