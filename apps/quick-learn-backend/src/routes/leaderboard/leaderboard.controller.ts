import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { BasePaginationDto, SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Leaderboard')
@Controller({
  path: 'leaderboard',
  version: '1',
})
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/list')
  async getLeaderboardDataTable(
    @Query() paginationDto: BasePaginationDto,
    @Query('type') type: string,
  ): Promise<SuccessResponse> {
    const leaderboardData = await this.leaderboardService.getLeaderboardData(
      type,
      Number(paginationDto.page),
      Number(paginationDto.limit),
    );
    return new SuccessResponse(en.successLeaderboardData, leaderboardData);
  }
}
