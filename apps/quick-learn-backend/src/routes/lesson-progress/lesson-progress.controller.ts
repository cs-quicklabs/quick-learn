import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { LessonProgressService } from './lesson-progress.service';
import {
  Controller,
  Post,
  Param,
  Body,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@src/entities';
import { en } from '@src/lang/en';
import { Public } from '@src/common/decorators/public.decorator';
import { LessonProgressParamsDto } from './dto/lessonProgress-params.dto';
import { completeBodyDto } from './dto/complete-body.dto';
@ApiTags('Lessons Progress')
@Controller({ path: 'lessonprogress', version: '1' })
@UseGuards(JwtAuthGuard)
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post('complete/:lessonId/:userId?')
  @ApiOperation({ summary: 'Mark Lesson as Completed' })
  async markLessonAsCompleted(
    @Body() dto: completeBodyDto,
    @CurrentUser() user: UserEntity,
    @Param() params: LessonProgressParamsDto,
  ) {
    const currentUser = +params.userId ? +params.userId : user.id;
    const response = await this.lessonProgressService.markLessonAsCompleted(
      currentUser,
      +params.lessonId,
      +dto.courseId,
    );
    if (dto.isCompleted) {
      return new SuccessResponse(en.successfullyCompletedLesson, {
        isRead: !!response,
        completed_date: response.completed_date,
      });
    } else {
      return new SuccessResponse(en.lessonMarkedUnRead);
    }
  }

  @Post('complete-public/:lessonId/:userId')
  @Public()
  @ApiOperation({ summary: 'Mark lesson as completed (public url)' })
  async markLessonAsCompletedPublic(
    @Body() dto: completeBodyDto,
    @Param() params: LessonProgressParamsDto,
  ) {
    const currentUser = +params.userId;
    const response = await this.lessonProgressService.markLessonAsCompleted(
      currentUser,
      +params.lessonId,
      +dto.courseId,
    );
    if (dto.isCompleted) {
      return new SuccessResponse(en.successfullyCompletedLesson, {
        isRead: !!response,
        completed_date: response.completed_date,
      });
    } else {
      return new SuccessResponse(en.lessonMarkedUnRead);
    }
  }

  @ApiParam({
    name: 'courseId',
    type: 'string',
    required: true,
  })
  @Get(':courseId/progress')
  @ApiOperation({ summary: 'Get lesson Progress' })
  async getLessonProgress(@Param('courseId') courseId: string, @Request() req) {
    const data = await this.lessonProgressService.getLessonProgressArray(
      req.user.id,
      +courseId,
    );
    return new SuccessResponse(en.courseCompletedLessons, data);
  }

  @ApiParam({
    name: 'userID',
    type: 'string',
    required: false,
  })
  @Get('/userprogress/:userID?')
  @ApiOperation({ summary: 'Get user Progress' })
  async getAllUserProgress(
    @CurrentUser() curentUser,
    @Param('userID') userID?: string,
  ) {
    const data =
      await this.lessonProgressService.getUserLessonProgressViaCourse(
        userID ? +userID : curentUser.id,
      );
    return new SuccessResponse(en.userProgressGrouped, data);
  }

  @ApiParam({
    name: 'userID',
    required: false,
    type: String,
    description: 'user ID',
  })
  @ApiOperation({ summary: 'Get daily lesson' })
  @Get('daily-lesson/:userID')
  async getAllDailyLesson(@Param('userID') userID?: string) {
    const data = await this.lessonProgressService.getDailyLessonProgress(
      +userID,
    );
    return new SuccessResponse(en.allDailyLessons, data);
  }

  @Get('check/:lessonId/:userId?')
  @ApiOperation({ summary: 'Check whether the lesson is readed or not' })
  async checkIsRead(
    @Param() params: LessonProgressParamsDto,
    @CurrentUser() user: UserEntity,
  ) {
    const currentUserViewed = +params.userId ? +params.userId : user.id;
    const data = await this.lessonProgressService.checkLessonRead(
      currentUserViewed,
      +params.lessonId,
    );
    return new SuccessResponse(en.lessonStatus, data);
  }

  @Get('check-public/:lessonId/:userId')
  @Public()
  @ApiOperation({
    summary: 'check whether the lesson is readed or not (public)',
  })
  async checkIsReadPublic(@Param() params: LessonProgressParamsDto) {
    const currentUserViewed = +params.userId;
    const data = await this.lessonProgressService.checkLessonRead(
      currentUserViewed,
      +params.lessonId,
    );
    return new SuccessResponse(en.lessonStatus, data);
  }
}
