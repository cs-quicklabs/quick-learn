import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services';
import { QuarterlyLeaderboardEntity } from '@src/entities';
import { Repository } from 'typeorm';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import Helpers from '@src/common/utils/helper';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { PaginatedResult } from '@src/common/interfaces';

export class QuarterlyLeaderboardService extends PaginationService<QuarterlyLeaderboardEntity> {
  constructor(
    @InjectRepository(QuarterlyLeaderboardEntity)
    repo: Repository<QuarterlyLeaderboardEntity>,
    private readonly lessonProgressService: LessonProgressService,
  ) {
    super(repo);
  }

  async findOne(id: number): Promise<QuarterlyLeaderboardEntity> {
    return await this.get({
      user_id: id,
      quarter: Helpers.getPreviousQuarter(),
      year: new Date().getFullYear(),
    });
  }

  async findTotalMember(): Promise<number> {
    return await this.count({
      quarter: Helpers.getPreviousQuarter(),
      year: new Date().getFullYear(),
    });
  }

  async getLastQuarterRanking(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<QuarterlyLeaderboardEntity>> {
    const currYear = new Date().getFullYear();
    const lastQuarter = Helpers.getPreviousQuarter();

    const queryBuilder = this.repository
      .createQueryBuilder('quarterly_leaderboard')
      .leftJoinAndSelect('quarterly_leaderboard.user', 'user')
      .where(
        'quarterly_leaderboard.quarter = :quarter AND quarterly_leaderboard.year = :year',
        { quarter: lastQuarter, year: currYear },
      )
      .orderBy('quarterly_leaderboard.rank', 'ASC');

    return await this.queryBuilderPaginate(queryBuilder, page, limit);
  }

  async createLeaderboardQuaterlyRanking(type: LeaderboardTypeEnum) {
    const currYear = new Date().getFullYear();
    const lastQuarter = Helpers.getPreviousQuarter();

    await this.delete({
      quarter: lastQuarter,
      year: currYear,
    });

    const leaderboardData =
      await this.lessonProgressService.calculateLeaderBoardPercentage(type);
    return this.repository.save(
      leaderboardData.map((entry, index) => ({
        user_id: entry.user_id,
        lessons_completed_count: entry.lesson_completed_count,
        rank: index + 1,
        quarter: lastQuarter,
        year: currYear,
      })),
    );
  }
}
