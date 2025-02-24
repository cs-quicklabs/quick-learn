import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import { PaginationService } from '@src/common/services';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { en } from '@src/lang/en';

@Injectable()
export class LeaderboardService extends PaginationService<Leaderboard> {
  private logger = new Logger(LeaderboardService.name);
  constructor(
    @InjectRepository(Leaderboard)
    repo: Repository<Leaderboard>,
    private readonly lessonProgressService: LessonProgressService,
  ) {
    super(repo);
  }

  async getLeaderboardData(type: LeaderboardTypeEnum, page = 1, limit = 10) {
    return this.paginate(
      {
        limit,
        page,
      },
      {
        type,
      },
      ['user'],
      { rank: 'ASC' },
    );
  }

  async createLeaderboardRanking(type: LeaderboardTypeEnum) {
    await this.deleteLeaderboardData(type);
    const LeaderboardData =
      await this.lessonProgressService.calculateLeaderBoardPercentage(type);

    return this.repository.save(
      LeaderboardData.map((entry, index) => ({
        user_id: entry.user_id,
        lessons_completed_count: entry.lesson_completed_count,
        rank: index + 1,
        type,
      })),
    );
  }

  async deleteLeaderboardData(type: LeaderboardTypeEnum) {
    try {
      return await this.delete({
        type,
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(en.leaderboardDeleteError, 500);
    }
  }
}
