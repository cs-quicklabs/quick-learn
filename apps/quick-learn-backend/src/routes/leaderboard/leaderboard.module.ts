import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { QuarterlyLeaderboardEntity } from '@src/entities';
import { QuarterlyLeaderboardService } from './quarterly-leaderboard.service';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, QuarterlyLeaderboardService],
  exports: [LeaderboardService, QuarterlyLeaderboardService],
  imports: [
    TypeOrmModule.forFeature([Leaderboard, QuarterlyLeaderboardEntity]),
    LessonProgressModule,
  ],
})
export class LeaderboardModule {}
