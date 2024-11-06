import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetLessonByIdQueryDto {
  @ApiProperty({ example: '7', required: true })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ example: '7', required: true })
  @IsOptional()
  @IsString()
  roadmapId?: string;
}
