import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserLessonParamDto {
  @ApiProperty({
    name: 'id',
    required: true,
    type: String,
    description: 'Get the lesson by id',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiPropertyOptional({
    name: 'userId',
    required: false,
    type: Number, // Aligning with the actual type in the route
    description: 'Optional user ID',
  })
  @IsOptional()
  userId: number;
}
