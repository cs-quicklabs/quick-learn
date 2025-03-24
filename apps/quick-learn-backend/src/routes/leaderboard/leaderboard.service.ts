import { QuarterlyLeaderboardService } from './quarterly-leaderboard.service';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import { PaginationService } from '@src/common/services';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { en } from '@src/lang/en';
import { LeaderboardEntity } from '@src/entities/leaderboard.entity';

interface ILeaderboardPaginationParams {
  page: number;
  limit: number;
  type: LeaderboardTypeEnum;
  team_id: number;
}

@Injectable()
export class LeaderboardService extends PaginationService<LeaderboardEntity> {
  private readonly logger = new Logger(LeaderboardService.name);
  constructor(
    @InjectRepository(LeaderboardEntity)
    repo: Repository<LeaderboardEntity>,
    private readonly QuarterlyLeaderboardService: QuarterlyLeaderboardService,
    private readonly lessonProgressService: LessonProgressService,
  ) {
    super(repo);
  }

  async findOne(id: number, type: LeaderboardTypeEnum) {
    return await this.repository.findOne({
      where: {
        user_id: id,
        type: type,
      },
    });
  }
  async findTotalMember(type: LeaderboardTypeEnum) {
    return await this.repository.count({
      where: {
        type: type,
      },
    });
  }

  async getLeaderboardData({
    type,
    page = 1,
    limit = 10,
    team_id,
  }: ILeaderboardPaginationParams) {
    switch (type) {
      case LeaderboardTypeEnum.WEEKLY:
      case LeaderboardTypeEnum.MONTHLY:
        return this.getLeaderboardWeekAndMonthRanking({
          type,
          page,
          limit,
          team_id,
        });

      case LeaderboardTypeEnum.QUARTERLY:
        return this.QuarterlyLeaderboardService.getLastQuarterRanking(
          page,
          limit,
          team_id,
        );

      default:
        throw new Error(`Invalid leaderboard type: ${type}`);
    }
  }
  async getLeaderboardWeekAndMonthRanking({
    type,
    page = 1,
    limit = 10,
    team_id,
  }: ILeaderboardPaginationParams) {
    return this.paginate(
      {
        limit,
        page,
      },
      {
        team_id,
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
