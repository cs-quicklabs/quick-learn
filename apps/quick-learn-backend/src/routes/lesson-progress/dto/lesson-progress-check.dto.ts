import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LessonProgressCheckDto {
  @ApiProperty({
    name: 'lessonId',
    required: true,
    type: String, // Route parameters are strings by default
    description: 'The lesson ID to check if marked or not',
  })
  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @ApiProperty({
    name: 'userId',
    required: true,
    type: Number, // Route parameters are strings by default
    description: 'Optional user ID',
  })
  @IsNotEmpty()
  userId: number;
}
