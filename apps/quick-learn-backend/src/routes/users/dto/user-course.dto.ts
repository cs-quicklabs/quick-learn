import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCourseDto {
  @ApiProperty({
    name: 'id',
    required: true,
    type: String,
    description: 'Get the course by id',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    name: 'userId',
    required: false,
    type: Number, // Aligning with the actual type in the route
    description: 'Optional user ID',
  })
  @IsOptional()
  userId: number;
}
