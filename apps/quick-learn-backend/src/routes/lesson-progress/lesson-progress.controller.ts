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
import { ApiParam } from '@nestjs/swagger';
import { UserEntity } from '@src/entities';
import { en } from '@src/lang/en';
import { Public } from '@src/common/decorators/public.decorator';

@Controller({ path: 'lessonprogress', version: '1' })
@UseGuards(JwtAuthGuard)
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post('complete/:lessonId/:userId?')
  @Public()
  @ApiParam({
    name: 'lessonId',
    required: true,
    type: String, // Route parameters are strings by default
    description: 'The lesson ID to be marked as completed or unread',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    type: Number, // Route parameters are strings by default
    description: 'Optional user ID',
  })
  async markLessonAsCompleted(
    @Body() dto: { courseId: number; isCompleted: boolean },
    @CurrentUser() user: UserEntity,
    @Param('lessonId') lessonId: number,
    @Param('userId') userId?: number,
  ) {
    const currentUser = (user && user.id) || userId;
    const response = await this.lessonProgressService.markLessonAsCompleted(
      currentUser,
      lessonId,
      dto.courseId,
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

  @Get(':courseId/progress')
  async getLessonProgress(@Param('courseId') courseId: number, @Request() req) {
    const data = await this.lessonProgressService.getLessonProgressArray(
      req.user.id,
      courseId,
    );
    return new SuccessResponse(en.courseCompletedLessons, data);
  }

  @Get('/userprogress/:userID?')
  async getAllUserProgress(
    @CurrentUser() curentUser,
    @Param('userID') userID?: number,
  ) {
    const data =
      await this.lessonProgressService.getUserLessonProgressViaCourse(
        userID ? userID : curentUser.id,
      );
    return new SuccessResponse(en.userProgressGrouped, data);
  }

  @ApiParam({
    name: 'userID',
    required: false,
    type: Number,
    description: 'user ID',
  })
  @Get('daily-lesson/:userID')
  async getAllDailyLesson(@Param('userID') userID?: number) {
    const data = await this.lessonProgressService.getDailyLessonProgress(
      userID,
    );
    return new SuccessResponse(en.allDailyLessons, data);
  }

  @Get('check/:lessonId/:userId?')
  @Public()
  @ApiParam({
    name: 'lessonId',
    required: true,
    type: String, // Route parameters are strings by default
    description: 'The lesson ID to check if marked or not',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    type: Number, // Route parameters are strings by default
    description: 'Optional user ID',
  })
  async checkIsRead(
    @Param('lessonId') lessonId: number,
    @CurrentUser() user: UserEntity,
    @Param('userId') userId?: number,
  ) {
    const currentUserViewed = userId ? userId : user.id;
    const data = await this.lessonProgressService.checkLessonRead(
      currentUserViewed,
      lessonId,
    );
    return new SuccessResponse(en.lessonStatus, data);
  }
}
