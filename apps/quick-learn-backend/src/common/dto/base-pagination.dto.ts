import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BasePaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @IsIn([10, 25, 50, 100])
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ example: 'q', required: false })
  @IsOptional()
  @IsString()
  q?: string;
}
