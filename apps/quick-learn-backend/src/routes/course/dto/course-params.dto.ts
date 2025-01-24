import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class courseParamsDto {
  @ApiProperty({
    name: 'id',
    description: 'course id',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
