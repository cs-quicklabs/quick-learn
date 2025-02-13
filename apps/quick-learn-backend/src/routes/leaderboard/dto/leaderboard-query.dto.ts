import { IsEnum } from 'class-validator';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { BasePaginationDto } from '@src/common/dto';
import { ApiProperty } from '@nestjs/swagger';
export class LeaderboardQueryDto extends BasePaginationDto {
  @ApiProperty({
    name: 'type',
    required: true,
    type: LeaderboardTypeEnum,
    description: 'Get what is the type of the leaderboard',
    default: LeaderboardTypeEnum.WEEKLY,
  })
  @IsEnum(LeaderboardTypeEnum)
  type: LeaderboardTypeEnum;
}
