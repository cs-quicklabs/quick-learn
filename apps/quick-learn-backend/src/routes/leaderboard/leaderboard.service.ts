import { Injectable } from '@nestjs/common';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
import { MonthlyLeaderboard } from '@src/entities/monthly-leaderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
    @InjectRepository(MonthlyLeaderboard)
    private readonly monthlyLeaderboardRepository: Repository<MonthlyLeaderboard>,
    private readonly lessonProgressService: LessonProgressService,
  ) {}

  async getLeaderboardData(type: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let items: any[] = [];
    let total = 0;

    if (type === 'monthly') {
      [items, total] = await this.monthlyLeaderboardRepository.findAndCount({
        skip,
        take: limit,
        order: {
          rank_monthly: 'ASC',
        },
        relations: ['user'],
      });
    } else {
      [items, total] = await this.leaderboardRepository.findAndCount({
        skip,
        take: limit,
        order: {
          rank: 'ASC',
        },
        relations: ['user'],
      });
    }

    return {
      items,
      total,
      currentPage: page,
      hasMore: skip + items.length < total,
    };
  }

  async createLeaderboardRanking(type: string = 'weekly') {
    await this.deleteLeaderboardData(type);
    const LeaderboardData =
      await this.lessonProgressService.calculateLeaderBoardPercentage(type);

    if (type === 'monthly') {
      return this.monthlyLeaderboardRepository.save(
        LeaderboardData.map((entry, index) => ({
          user_id: entry.user_id,
          lessons_completed_count_monthly: entry.lesson_completed_count,
          rank_monthly: index + 1,
        })),
      );
    } else {
      return this.leaderboardRepository.save(
        LeaderboardData.map((entry, index) => ({
          user_id: entry.user_id,
          lessons_completed_count: entry.lesson_completed_count,
          rank: index + 1,
        })),
      );
    }
  }
  async deleteLeaderboardData(type: string = 'weekly') {
    try {
      let result;
      if (type === 'monthly') {
        result = await this.monthlyLeaderboardRepository.delete({});
      } else {
        result = await this.leaderboardRepository.delete({});
      }
      return result;
    } catch (error) {
      throw new Error('Failed to delete leaderboard data');
    }
  }
}
