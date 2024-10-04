import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Name should be less than 50 characters' })
  name: string;

  @ApiProperty({ example: 'Lesson content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  course_id: number;
}
