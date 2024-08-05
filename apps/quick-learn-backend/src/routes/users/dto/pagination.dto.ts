import { ApiProperty } from '@nestjs/swagger';
import { BasePaginationDto } from '@src/common/dto';
import { IsIn, IsOptional } from 'class-validator';

export class PaginationDto extends BasePaginationDto {
  @ApiProperty({ example: 'paginate' })
  @IsOptional()
  @IsIn(['paginate'])
  mode?: 'paginate';
}
