import { Module } from '@nestjs/common';
import { LessonEmailService } from './lesson-email-cron.service';
import { UsersModule } from '../users/users.module';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { CronjobController } from './cronjob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailModule,
  LessonTokenModule,
  SessionModule,
} from '@src/common/modules';
import { LeaderboardEntity } from '@src/entities/leaderboard.entity';
import { LeaderboardCronService } from './leaderboard-cron.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { AuthModule } from '../auth/auth.module';
import { QuarterlyLeaderboardEntity } from '@src/entities';
import { TokenCleanupService } from './token-cleanup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaderboardEntity, QuarterlyLeaderboardEntity]),
    UsersModule,
    LessonProgressModule,
    EmailModule,
    LeaderboardModule,
    LessonTokenModule,
    AuthModule,
    SessionModule,
  ],
  providers: [TokenCleanupService, LessonEmailService, LeaderboardCronService],
  controllers: [CronjobController],
})
export class CronjobModule {}
