import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LessonEntity,
  LessonTokenEntity,
  UserEntity,
  UserLessonProgressEntity,
} from '@src/entities';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { CourseModule } from '../course/course.module';
import { FileModule } from '@src/file/file.module';
import { LessonEmailService } from './lesson-email-cron.service';
import { UsersModule } from '../users/users.module';
import { EmailService } from '@src/common/modules/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LessonEntity,
      UserEntity,
      UserLessonProgressEntity,
      LessonTokenEntity,
    ]),
    CourseModule,
    forwardRef(() => UsersModule),
    FileModule,
  ],
  providers: [LessonService, LessonEmailService, EmailService, Logger],
  controllers: [LessonController],
  exports: [LessonService, LessonEmailService],
})
export class LessonModule {}
