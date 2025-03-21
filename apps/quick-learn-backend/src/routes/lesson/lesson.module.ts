import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity, FlaggedLessonEntity, UserEntity } from '@src/entities';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { CourseModule } from '../course/course.module';
import { FileModule } from '@src/file/file.module';
import { UsersModule } from '../users/users.module';
import { EmailService } from '@src/common/modules/email/email.service';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { FlaggedLessonService } from './flagged-lesson.service';
import { LessonTokenModule } from '@src/common/modules';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonEntity, FlaggedLessonEntity, UserEntity]),
    CourseModule,
    forwardRef(() => UsersModule),
    FileModule,
    LessonProgressModule,
    LessonTokenModule,
    AuthModule,
  ],
  providers: [LessonService, EmailService, FlaggedLessonService],
  controllers: [LessonController],
  exports: [LessonService],
})
export class LessonModule {}
