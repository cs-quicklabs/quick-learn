import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class lessonProgressParamsDto {
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
    type: String, // Route parameters are strings by default
    description: 'Optional user ID',
  })
  @IsOptional()
  @IsString()
  userId: string;
}
