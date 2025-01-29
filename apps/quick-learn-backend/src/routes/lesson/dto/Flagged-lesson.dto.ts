import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FlagLessonDto {
  @ApiProperty({
    description: 'ID of the course the lesson belongs to',
    example: 1,
  })
  @IsInt()
  courseId: number;
}
