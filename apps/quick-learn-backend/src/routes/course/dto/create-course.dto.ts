import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Course Name',
    description: 'The name of the course',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Course Description',
    description: 'The description of the course',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: false, description: 'The category id of the course' })
  @IsNotEmpty()
  @IsBoolean()
  is_community_available: boolean;

  @ApiProperty({
    example: 1,
    description: 'The roadmap id in which you want to assign.',
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  roadmap_id: number;

  @ApiProperty({ example: 1, description: 'The category id of the course' })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  course_category_id: number;
}
