import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { ApiTags } from '@nestjs/swagger';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { JwtAuthGuard } from '../auth/guards';
@ApiTags('Leaderboard')
@Controller({
  path: 'leaderboard',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/list')
  async getLeaderboardDataTable(
    @Query() params: LeaderboardQueryDto,
  ): Promise<SuccessResponse> {
    const leaderboardData = await this.leaderboardService.getLeaderboardData(
      params.type,
      Number(params.page),
      Number(params.limit),
    );
    return new SuccessResponse(en.successLeaderboardData, leaderboardData);
  }
}
