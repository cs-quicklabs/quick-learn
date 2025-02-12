import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { MonthlyLeaderboard } from '@src/entities/monthly-leaderboard.entity';
@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
  imports: [
    TypeOrmModule.forFeature([Leaderboard, MonthlyLeaderboard]),
    LessonProgressModule,
  ],
})
export class LeaderboardModule {}
