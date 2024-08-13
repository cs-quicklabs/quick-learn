import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'ReactJS' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  team_id: number;
}
