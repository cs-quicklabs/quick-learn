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

@Controller({ path: 'lessonprogress', version: '1' })
@UseGuards(JwtAuthGuard)
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post('complete/:lessonId')
  async markLessonAsCompleted(
    @Param('lessonId') lessonId: number,
    @Body() dto: { courseId: number },
    @Request() req,
  ) {
    await this.lessonProgressService.markLessonAsCompleted(
      req.user.id,
      lessonId,
      dto.courseId,
    );
    return new SuccessResponse('Successfully completed the lesson');
  }

  @Get(':courseId/progress')
  async getLessonProgress(@Param('courseId') courseId: number, @Request() req) {
    return await this.lessonProgressService.getLessonProgressArray(
      req.user.id,
      courseId,
    );
  }

  // @Get(':courseId/progresscount')
  // async getLessonProgressCount(
  //   @Param('courseId') courseId: number,
  //   @Request() req,
  // ) {
  //   return await this.lessonProgressService.getCourseLessonCount(
  //     req.user.id,
  //     courseId,
  //   );
  // }

  @Get('/userprogress')
  async getAllUserProgress(@Request() req) {
    return await this.lessonProgressService.getUserLessonProgressViaCourse(
      req.user.id,
    );
  }

  @Get('check/:lessonId')
  async checkIsRead(@Param('lessonId') lessonId: number, @Request() req) {
    return await this.lessonProgressService.checkLessonRead(
      req.user.id,
      lessonId,
    );
  }
}
