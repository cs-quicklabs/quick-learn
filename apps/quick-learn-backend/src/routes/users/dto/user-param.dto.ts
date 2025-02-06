import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserParamDto {
  @ApiProperty({
    name: 'userId',
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  userId: number;
}
