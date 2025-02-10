import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LessonProgressCompleteDto {
  @ApiProperty({
    name: 'lessonId',
    required: true,
    type: String, // Route parameters are strings by default
    description: 'The lesson ID to be marked as completed or unread',
  })
  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @ApiProperty({
    name: 'userId',
    required: false,
    type: Number, // Route parameters are strings by default
    description: 'Optional user ID',
  })
  @IsOptional()
  userId: number;
}
