import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { LessonEmailService } from './lesson-email-cron.service';
import { JwtAuthGuard } from '../auth/guards';
import { LeaderboardCronService } from './leaderboard-cron.service';
import {
  CronjobQueryParamDto,
  CronjobLeaderboardQueryParamDto,
} from './dto/cronjob-query.dto';
/**
 * Controller for cronjob routes
 */
@ApiTags('Custom Triggers for the cronjobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserTypeId.SUPER_ADMIN)
@Controller({
  path: 'cronjob',
  version: '1',
})
export class CronjobController {
  constructor(
    private readonly lessonCronJobService: LessonEmailService,
    private readonly leaderboardCronService: LeaderboardCronService,
  ) {}

  @Post('daily-lessons')
  @ApiOperation({ summary: 'Send daily lessons to the users.' })
  async triggerCronJobmaunually(
    @Query() param: CronjobQueryParamDto,
  ): Promise<SuccessResponse> {
    await this.lessonCronJobService.sendLessonEmails(param.greeting);
    return new SuccessResponse(en.triggeredDailyLessonMails);
  }

  @ApiOperation({
    summary: 'Create new Ranking and send leaderboard email to the users.',
  })
  @Post('leaderboard-email')
  async triggerLeaderboardEmail(
    @Query() param: CronjobLeaderboardQueryParamDto,
  ): Promise<SuccessResponse> {
    await this.leaderboardCronService.sendLeaderboardEmail(param.type);
    return new SuccessResponse(en.triggeredLeaderboardEmail);
  }
}
