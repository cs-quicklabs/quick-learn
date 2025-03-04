import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { QuarterlyLeaderboardEntity } from '@src/entities';
import { QuarterlyLeaderboardService } from './quarterly-leaderboard.service';
import { LeaderboardEntity } from '@src/entities/leaderboard.entity';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, QuarterlyLeaderboardService],
  exports: [LeaderboardService, QuarterlyLeaderboardService],
  imports: [
    TypeOrmModule.forFeature([LeaderboardEntity, QuarterlyLeaderboardEntity]),
    LessonProgressModule,
  ],
})
export class LeaderboardModule {}
