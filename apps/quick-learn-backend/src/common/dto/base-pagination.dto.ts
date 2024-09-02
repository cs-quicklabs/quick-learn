import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BasePaginationDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsInt()
  @IsIn([10, 25, 50, 100])
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ example: 'updated_at' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ example: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ example: 'paginate' })
  @IsOptional()
  @IsString()
  q?: string;
}
