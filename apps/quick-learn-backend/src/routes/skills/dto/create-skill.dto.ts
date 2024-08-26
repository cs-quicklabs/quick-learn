import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'ReactJS' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Skill name is too short' })
  @MaxLength(30, { message: 'Skill name is too long' })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  team_id: number;
}
