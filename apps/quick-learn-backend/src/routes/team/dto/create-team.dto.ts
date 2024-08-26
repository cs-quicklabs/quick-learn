import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'CS Warriors' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
