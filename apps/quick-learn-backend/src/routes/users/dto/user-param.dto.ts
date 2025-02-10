import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserParamDto {
  @ApiProperty({
    name: 'userId',
    type: 'number',
    required: true,
  })
  @IsOptional()
  userId: number;
}
