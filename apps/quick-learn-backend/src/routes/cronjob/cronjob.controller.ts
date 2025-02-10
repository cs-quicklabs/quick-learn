import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { LessonEmailService } from './lesson-email-cron.service';
import { JwtAuthGuard } from '../auth/guards';
import { LeaderboardCronService } from './leaderboard-cron.service';
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

  /**
   *@ApiQueryParam greeting
   *@returns success response
   */
  @ApiQuery({
    name: 'greeting',
    required: true,
    type: String,
    description: 'Get what is the greeting for the mail',
  })
  @Post('daily-lessons')
  @ApiOperation({ summary: 'Send daily lessons to the users.' })
  async triggerCronJobmaunually(
    @Query('greeting') greeting: string,
  ): Promise<SuccessResponse> {
    await this.lessonCronJobService.sendLessonEmails(greeting);
    return new SuccessResponse(en.triggeredDailyLessonMails);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserTypeId.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Create new Ranking and send leaderboard email to the users.',
  })
  @Post('leaderboard-email')
  async triggerLeaderboardEmail(): Promise<SuccessResponse> {
    await this.leaderboardCronService.sendLeaderboardEmail();
    return new SuccessResponse(en.triggeredLeaderboardEmail);
  }
}
