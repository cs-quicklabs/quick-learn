import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLessonProgressEntity } from '@src/entities';
import { LessonProgressController } from './lesson-progress.controller';
import { LessonProgressService } from './lesson-progress.service';
import { CourseModule } from '../course/course.module';
import { LessonTokenModule } from '@src/common/modules';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserLessonProgressEntity]),
    CourseModule,
    LessonTokenModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService], // Export the service if you need to use it in other modules
})
export class LessonProgressModule {}
