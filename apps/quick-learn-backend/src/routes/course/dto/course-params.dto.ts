import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CourseParamsDto {
  @ApiProperty({
    name: 'id',
    description: 'course id',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
