import { IsEnum } from 'class-validator';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { BasePaginationDto } from '@src/common/dto';
import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardQueryDto extends BasePaginationDto {
  @ApiProperty({
    enum: LeaderboardTypeEnum,
    enumName: 'LeaderboardTypeEnum',
    description: 'Get what is the type of the leaderboard',
    default: LeaderboardTypeEnum.WEEKLY,
    required: true,
  })
  @IsEnum(LeaderboardTypeEnum)
  type: LeaderboardTypeEnum;
}
