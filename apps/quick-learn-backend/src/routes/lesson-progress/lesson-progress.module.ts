import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLessonProgressEntity } from '@src/entities/user-lesson-progress.entity';
import {
  CourseEntity,
  LessonEntity,
  LessonTokenEntity,
  UserEntity,
} from '@src/entities';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { LessonProgressController } from './lesson-progress.controller';
import { LessonProgressService } from './lesson-progress.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserLessonProgressEntity,
      LessonTokenEntity,
      LessonEntity,
      CourseEntity,
      UserEntity,
      Leaderboard,
    ]),
  ],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService], // Export the service if you need to use it in other modules
})
export class LessonProgressModule {}
