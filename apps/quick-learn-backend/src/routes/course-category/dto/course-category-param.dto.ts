import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CourseCategoryParamDto {
  @ApiProperty({
    name: 'id',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  id: string;
}
