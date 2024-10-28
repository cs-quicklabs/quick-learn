import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetUserQueryDto {
  @ApiProperty({ example: true, description: 'Load assigned roadmaps' })
  @IsOptional()
  @Transform(({ value }) => {
    return value == 'true';
  })
  @IsBoolean()
  is_load_assigned_roadmaps?: boolean;

  @ApiProperty({ example: true, description: 'Load assigned courses' })
  @IsOptional()
  @Transform(({ value }) => {
    return value == 'true';
  })
  @IsBoolean()
  is_load_assigned_courses?: boolean;
}
