import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenValidationDto {
  @ApiProperty({
    name: 'lessonId',
    required: true,
    type: String,
    description: 'Get the lesson by id',
  })
  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @ApiProperty({
    name: 'courseId',
    required: true,
    type: String,
    description: 'Get lesson by course id',
  })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({
    name: 'token',
    required: true,
    type: String,
    description: 'validate lesson url using token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
