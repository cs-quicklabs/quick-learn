import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CronjobQueryParamDto {
  @ApiProperty({
    name: 'greeting',
    required: true,
    type: String,
    description: 'Get what is the greeting for the mail',
  })
  @IsNotEmpty()
  @IsString()
  greeting: string;
}

export class CronjobLeaderboardQueryParamDto {
  @ApiProperty({
    name: 'type',
    required: true,
    type: String,
    description: 'Get what is the type of the leaderboard',
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}
