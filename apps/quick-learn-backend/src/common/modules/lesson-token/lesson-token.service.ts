import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { LessonTokenEntity } from '@src/entities';

@Injectable()
export class LessonTokenService extends BasicCrudService<LessonTokenEntity> {
  constructor(@InjectRepository(LessonTokenEntity) repo) {
    super(repo);
  }

  /**
   * Retrieves the daily lesson progress for a user, including associated lesson details.
   * @param userId - The ID of the user.
   * @returns An array of daily lesson progress records with lesson details.
   */
  async getAllTokenByUserId(userId: number) {
    return await this.repository
      .createQueryBuilder('lesson_tokens')
      .leftJoinAndSelect('lesson_tokens.lesson', 'lesson')
      .where('lesson_tokens.user_id = :userId', { userId })
      .select(['lesson_tokens', 'lesson.name'])
      .getMany();
  }

  async getCompletedToken(thisDate: { start: string; end: string }) {
    return await this.repository
      .createQueryBuilder('lesson_token')
      .where(
        'lesson_token.created_at >= :startDate AND lesson_token.created_at <= :endDate',
        {
          startDate: thisDate.start,
          endDate: thisDate.end,
        },
      )
      .andWhere('lesson_token.status = :status', { status: 'COMPLETED' })
      .select('lesson_token.user_id', 'userId')
      .addSelect('ARRAY_AGG(lesson_token.lesson_id)', 'lessonIds')
      .addSelect('ARRAY_AGG(lesson_token.created_at)', 'createdAtArray')
      .groupBy('lesson_token.user_id')
      .getRawMany();
  }

  async getUsersTokenBetweenDates(thisDate: { start: string; end: string }) {
    return await this.repository
      .createQueryBuilder('lesson_token')
      .where(
        'lesson_token.created_at >= :startDate AND lesson_token.created_at <= :endDate',
        {
          startDate: thisDate.start,
          endDate: thisDate.end,
        },
      )
      .leftJoinAndSelect('lesson_token.user', 'user')
      .select([
        'user.id AS user_id',
        'COUNT(lesson_token.id) AS lesson_count',
        'user.first_name AS first_name',
        'user.last_name AS last_name',
        'user.email AS email',
      ])
      .groupBy('user.id')
      .getRawMany();
  }
}
