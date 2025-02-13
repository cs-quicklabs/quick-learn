import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
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
    type: LeaderboardTypeEnum,
    description: 'Get what is the type of the leaderboard',
  })
  @IsNotEmpty()
  @IsEnum(LeaderboardTypeEnum)
  type: LeaderboardTypeEnum;
}
