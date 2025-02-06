import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParamDto {
  @ApiProperty({
    name: 'Id',
    type: String,
    description: 'Enter the lesson Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
