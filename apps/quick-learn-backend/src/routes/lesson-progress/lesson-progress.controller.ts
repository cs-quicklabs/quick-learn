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

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post(':lessonId/complete')
  async markLessonAsCompleted(
    @Param('lessonId') lessonId: number,
    @Body() dto: { courseId: number },
    @Request() req,
  ) {
    return await this.lessonProgressService.markLessonAsCompleted(
      req.user.id,
      lessonId,
      dto.courseId,
    );
  }

  @Get('progress/:courseId')
  async getLessonProgress(@Param('courseId') courseId: number, @Request() req) {
    return await this.lessonProgressService.getLessonProgress(
      req.user.id,
      courseId,
    );
  }
}
