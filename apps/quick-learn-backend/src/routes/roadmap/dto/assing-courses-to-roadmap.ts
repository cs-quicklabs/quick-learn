import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignCoursesToRoadmapDto {
  @ApiProperty({ example: ['1'] })
  @IsNotEmpty()
  @IsArray()
  courses: string[];
}
