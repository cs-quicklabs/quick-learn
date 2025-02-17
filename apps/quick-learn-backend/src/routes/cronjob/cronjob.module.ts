import { Module } from '@nestjs/common';
import { LessonEmailService } from './lesson-email-cron.service';
import { UsersModule } from '../users/users.module';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { CronjobController } from './cronjob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonTokenEntity } from '@src/entities';
import { EmailModule } from '@src/common/modules';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { LeaderboardCronService } from './leaderboard-cron.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
@Module({
  // TODO: Remove lesson token repository from here to use module
  imports: [
    UsersModule,
    LessonProgressModule,
    EmailModule,
    TypeOrmModule.forFeature([LessonTokenEntity, Leaderboard]),
    LeaderboardModule,
  ],
  providers: [LessonEmailService, LeaderboardCronService],
  controllers: [CronjobController],
})
export class CronjobModule {}
