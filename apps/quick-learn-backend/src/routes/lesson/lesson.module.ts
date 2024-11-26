import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity } from '@src/entities';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity]), CourseModule],
  providers: [LessonService],
  controllers: [LessonController],
  exports: [LessonService],
})
export class LessonModule {}
