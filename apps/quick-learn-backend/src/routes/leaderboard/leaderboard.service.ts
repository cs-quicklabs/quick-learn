import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import { PaginationService } from '@src/common/services';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { en } from '@src/lang/en';
import { QuarterlyLeaderboardEntity } from '@src/entities/quarterlyLeaderboard.entity';
import Helpers from '@src/common/utils/helper';

@Injectable()
export class LeaderboardService extends PaginationService<Leaderboard> {
  private logger = new Logger(LeaderboardService.name);
  constructor(
    @InjectRepository(Leaderboard)
    repo: Repository<Leaderboard>,
    @InjectRepository(QuarterlyLeaderboardEntity)
    private readonly quarterlyRepository: Repository<QuarterlyLeaderboardEntity>,
    private readonly lessonProgressService: LessonProgressService,
  ) {
    super(repo);
    this.quarterlyRepository = quarterlyRepository;
  }

  async getLeaderboardData(type: LeaderboardTypeEnum, page = 1, limit = 10) {
    switch (type) {
      case LeaderboardTypeEnum.WEEKLY:
      case LeaderboardTypeEnum.MONTHLY:
        return this.getLeaderboardWeekAndMonthRanking(type, page, limit);

      case LeaderboardTypeEnum.QUARTERLY:
        return this.getLastQuarterRanking(type, page, limit);

      default:
        throw new Error(`Invalid leaderboard type: ${type}`);
    }
  }
  async getLeaderboardWeekAndMonthRanking(
    type: LeaderboardTypeEnum,
    page = 1,
    limit = 10,
  ) {
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

  async getLastQuarterRanking(type: LeaderboardTypeEnum, page = 1, limit = 10) {
    const currYear = new Date().getFullYear();
    const lastQuarter = Helpers.getPreviousQuarter();

    const queryBuilder = this.quarterlyRepository
      .createQueryBuilder('quarterly_leaderboard')
      .leftJoinAndSelect('quarterly_leaderboard.user', 'user')
      .where(
        'quarterly_leaderboard.quarter = :quarter AND quarterly_leaderboard.year = :year',
        { quarter: lastQuarter, year: currYear },
      )
      .orderBy('quarterly_leaderboard.rank', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async createLeaderboardQuaterlyRanking(type: LeaderboardTypeEnum) {
    const currYear = new Date().getFullYear();
    const lastQuarter = Helpers.getPreviousQuarter();
    await this.quarterlyRepository.delete({
      quarter: lastQuarter,
      year: currYear,
    });
    const LeaderboardData =
      await this.lessonProgressService.calculateLeaderBoardPercentage(type);
    return this.quarterlyRepository.save(
      LeaderboardData.map((entry, index) => ({
        user_id: entry.user_id,
        lessons_completed_count: entry.lesson_completed_count,
        rank: index + 1,
        quarter: lastQuarter,
        year: currYear,
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
