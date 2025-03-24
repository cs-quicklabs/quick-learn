import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { ApiTags } from '@nestjs/swagger';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
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
    @CurrentUser('team_id') team_id: number,
  ): Promise<SuccessResponse> {
    const { type, page, limit } = params;
    const leaderboardData = await this.leaderboardService.getLeaderboardData({
      type,
      page,
      limit,
      team_id,
    });
    return new SuccessResponse(en.successLeaderboardData, leaderboardData);
  }
}
