import { Module } from '@nestjs/common';
import { LessonEmailService } from './lesson-email-cron.service';
import { UsersModule } from '../users/users.module';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';
import { CronjobController } from './cronjob.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule, LessonTokenModule } from '@src/common/modules';
import { LeaderboardEntity } from '@src/entities/leaderboard.entity';
import { LeaderboardCronService } from './leaderboard-cron.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { AuthModule } from '../auth/auth.module';
import { QuarterlyLeaderboardEntity } from '@src/entities';
@Module({
  // TODO: Remove lesson token repository from here to use module
  imports: [
    TypeOrmModule.forFeature([LeaderboardEntity, QuarterlyLeaderboardEntity]),
    UsersModule,
    LessonProgressModule,
    EmailModule,
    LeaderboardModule,
    LessonTokenModule,
    AuthModule,
  ],
  providers: [LessonEmailService, LeaderboardCronService],
  controllers: [CronjobController],
})
export class CronjobModule {}
