import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { LessonEmailService } from './lesson-email-cron.service';
import { JwtAuthGuard } from '../auth/guards';
import { CronjobQyeryDto } from './dto/cronjob-query.dto';

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
  constructor(private readonly lessonCronJobService: LessonEmailService) {}

  /**
   *@ApiQueryParam greeting
   *@returns success response
   */
  @Post('daily-lessons')
  @ApiOperation({ summary: 'Send daily lessons to the users.' })
  async triggerCronJobmaunually(
    @Query() query: CronjobQyeryDto,
  ): Promise<SuccessResponse> {
    await this.lessonCronJobService.sendLessonEmails(query.greeting);
    return new SuccessResponse(en.triggeredDailyLessonMails);
  }
}
