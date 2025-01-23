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
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { UserEntity } from '@src/entities';
import { en } from '@src/lang/en';
import { Public } from '@src/common/decorators/public.decorator';

@Controller({ path: 'lessonprogress', version: '1' })
@UseGuards(JwtAuthGuard)
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post('complete/:lessonId/:userId?')
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
  @ApiOperation({summary:'Mark Lesson as Completed'})
  async markLessonAsCompleted(
    @Body() dto: { courseId: number; isCompleted: boolean },
    @CurrentUser() user: UserEntity,
    @Param('lessonId') lessonId: number,
    @Param('userId') userId?: number,
  ) {
    const currentUser = userId ? userId : user.id;
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

  @Post('complete-public/:lessonId/:userId')
  @Public()
  @ApiParam({
    name: 'lessonId',
    required: true,
    type: String,
    description: 'The lesson ID to be marked as completed or unread',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    type: Number,
    description: 'Optional user ID',
  })
  @ApiOperation({summary:"Mark lesson as completed (public url)"})
  async markLessonAsCompletedPublic(
    @Body() dto: { courseId: number; isCompleted: boolean },
    @Param('lessonId') lessonId: number,
    @Param('userId') userId: number,
  ) {
    const currentUser = userId;
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
  @ApiOperation({summary:'Get lesson Progress'})
  async getLessonProgress(@Param('courseId') courseId: number, @Request() req) {
    const data = await this.lessonProgressService.getLessonProgressArray(
      req.user.id,
      courseId,
    );
    return new SuccessResponse(en.courseCompletedLessons, data);
  }

  @Get('/userprogress/:userID?')
  @ApiOperation({summary:'Get user Progress'})
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
  @ApiOperation({summary:'Get daily lesson'})
  @Get('daily-lesson/:userID')
  async getAllDailyLesson(@Param('userID') userID?: number) {
    const data = await this.lessonProgressService.getDailyLessonProgress(
      userID,
    );
    return new SuccessResponse(en.allDailyLessons, data);
  }

  @Get('check/:lessonId/:userId?')
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
  @ApiOperation({summary:'Check whether the lesson is readed or not'})
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

  @Get('check-public/:lessonId/:userId')
  @Public()
  @ApiParam({
    name: 'lessonId',
    required: true,
    type: String, // Route parameters are strings by default
    description: 'The lesson ID to check if marked or not',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    type: Number, // Route parameters are strings by default
    description: 'Optional user ID',
  })
  @ApiOperation({summary:'check whether the lesson is readed or not (public)'})
  async checkIsReadPublic(
    @Param('lessonId') lessonId: number,
    @Param('userId') userId: number,
  ) {
    const currentUserViewed = userId;
    const data = await this.lessonProgressService.checkLessonRead(
      currentUserViewed,
      lessonId,
    );
    return new SuccessResponse(en.lessonStatus, data);
  }
}
