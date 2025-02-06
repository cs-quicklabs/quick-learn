import { ApiProperty } from '@nestjs/swagger';

export class paramDto {
  @ApiProperty({
    name: 'id',
    required: true,
    type: 'string',
  })
  id: string;
}
