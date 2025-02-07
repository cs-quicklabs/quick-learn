import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLessonProgressEntity } from '@src/entities/user-lesson-progress.entity';
import { CourseEntity, LessonEntity, LessonTokenEntity } from '@src/entities';
import { BasicCrudService } from '@src/common/services';
import { previousSunday } from 'date-fns';
import { Leaderboard } from '@src/entities/leaderboard.entity';
import { PaginationService } from '@src/common/services/pagination.service';
@Injectable()
export class LessonProgressService extends BasicCrudService<UserLessonProgressEntity> {
  constructor(
    @InjectRepository(UserLessonProgressEntity)
    private userLessonProgressRepository: Repository<UserLessonProgressEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(LessonTokenEntity)
    private LessonTokenRepository: Repository<LessonTokenEntity>,
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,
    private paginationService: PaginationService<Leaderboard>,
  ) {
    super(userLessonProgressRepository);
  }

  private async validateLesson(lessonId: number, courseId: number) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, course_id: courseId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found in this course');
    }
    return lesson;
  }

  private async validateCourse(courseId: number) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  /**
   * Marks a lesson as completed for a user. If already marked, removes the completion record.
   * @param userId - The ID of the user completing the lesson.
   * @param lessonId - The ID of the lesson being marked as completed.
   * @param courseId - The ID of the course containing the lesson.
   * @returns A `UserLessonProgressEntity` representing the completion record.
   */

  async markLessonAsCompleted(
    userId: number,
    lessonId: number,
    courseId: number,
  ): Promise<UserLessonProgressEntity> {
    await this.validateLesson(lessonId, courseId);

    const existingProgress = await this.userLessonProgressRepository.findOne({
      where: {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
      },
    });

    if (existingProgress) {
      await this.userLessonProgressRepository.delete(existingProgress.id);
    } else {
      const newProgressEntry = this.userLessonProgressRepository.create({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed_date: new Date(),
      });

      return await this.userLessonProgressRepository.save(newProgressEntry);
    }
  }

  /**
   * Retrieves the lesson progress for a specific course for a user.
   * @param userId - The ID of the user.
   * @param courseId - The ID of the course.
   * @returns An array of objects containing lesson IDs and their completion dates.
   */
  async getLessonProgressArray(
    userId: number,
    courseId: number,
  ): Promise<{ lesson_id: number; completed_date: Date | null }[]> {
    await this.validateCourse(courseId);

    const completedLessons = await this.userLessonProgressRepository.find({
      where: {
        user_id: userId,
        course_id: courseId,
      },
      select: ['lesson_id', 'completed_date'],
    });

    return completedLessons.map(({ lesson_id, completed_date }) => ({
      lesson_id,
      completed_date,
    }));
  }
  async getUserLessonProgressViaCourse(userId: number): Promise<
    {
      course_id: number;
      lessons: { lesson_id: number; completed_date: Date | null }[];
    }[]
  > {
    const completedLessons = await this.userLessonProgressRepository
      .createQueryBuilder('userLessonProgress')
      .innerJoinAndSelect(
        'lesson',
        'lesson',
        'lesson.id = userLessonProgress.lesson_id',
      )
      .where('userLessonProgress.user_id = :userId', { userId })
      .select([
        'userLessonProgress.course_id AS course_id',
        'userLessonProgress.lesson_id AS lesson_id',
        'userLessonProgress.completed_date AS  completed_date',
        'lesson.name AS lesson_name', // Select lesson name
      ])
      .getRawMany();

    const courseProgressMap: {
      [course_id: number]: {
        lesson_name: string;
        lesson_id: number;
        completed_date: Date | null;
      }[];
    } = {};

    completedLessons.forEach(
      ({ course_id, lesson_name, lesson_id, completed_date }) => {
        if (!courseProgressMap[course_id]) {
          courseProgressMap[course_id] = [];
        }
        courseProgressMap[course_id].push({
          lesson_id,
          lesson_name,
          completed_date,
        });
      },
    );

    function groupDateToDesireFormatr() {
      const userProgress = Object.entries(courseProgressMap).map(
        ([course_id, lessons]) => ({
          course_id: Number(course_id),
          lessons,
        }),
      );
      return userProgress;
    }

    return groupDateToDesireFormatr();
  }
  /**
   * Checks whether a lesson is marked as read by the user.
   * @param userId - The ID of the user.
   * @param lessonId - The ID of the lesson to check.
   * @returns An object indicating whether the lesson is read and its completion date (if applicable).
   */
  async checkLessonRead(
    userId: number,
    lessonId: number,
  ): Promise<{ isRead: boolean; completed_date: Date | null }> {
    const checkLessonExist = await this.userLessonProgressRepository.findOne({
      where: {
        user_id: userId,
        lesson_id: lessonId,
      },
      select: ['id', 'completed_date'],
    });

    return {
      isRead: !!checkLessonExist,
      completed_date: checkLessonExist?.completed_date
        ? checkLessonExist?.completed_date
        : null,
    };
  }
  /**
   * Retrieves the daily lesson progress for a user, including associated lesson details.
   * @param userId - The ID of the user.
   * @returns An array of daily lesson progress records with lesson details.
   */

  async getDailyLessonProgress(userId: number) {
    const userDailyLessonProgress =
      await this.LessonTokenRepository.createQueryBuilder('lesson_tokens')
        .leftJoinAndSelect('lesson_tokens.lesson', 'lesson')
        .where('lesson_tokens.user_id = :userId', { userId })
        .select(['lesson_tokens', 'lesson.name'])
        .getMany();
    return userDailyLessonProgress;
  }

  async getLeaderboardDataService() {
    const toThisMonday = previousSunday(new Date().setHours(0, 0, 0, 0)); // last week Monday
    // toThisMonday.setHours(0, 0, 0, 0); // set hours for last week Monday

    const fromPreviousMonday = new Date(toThisMonday); // create a new Date object
    fromPreviousMonday.setDate(toThisMonday.getDate() - 7); // set to this week Monday
    fromPreviousMonday.setHours(0, 0, 0, 0); // set hours for this week Monday

    console.log(fromPreviousMonday, toThisMonday);
    const allUsers = await this.LessonTokenRepository.createQueryBuilder(
      'lesson_token',
    )
      .where('lesson_token.created_at >= :fromPreviousMonday', {
        fromPreviousMonday: fromPreviousMonday.toISOString(),
      })
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

    const completedLessonsData =
      await this.LessonTokenRepository.createQueryBuilder('lesson_token')
        .where('lesson_token.created_at >= :fromPreviousMonday ', {
          fromPreviousMonday: fromPreviousMonday.toISOString(),
        })
        .andWhere('lesson_token.status = :status', { status: 'COMPLETED' })
        .select('lesson_token.user_id', 'userId')
        .addSelect('ARRAY_AGG(lesson_token.lesson_id)', 'lessonIds')
        .addSelect('ARRAY_AGG(lesson_token.created_at)', 'createdAtArray')
        .groupBy('lesson_token.user_id')
        .getRawMany();

    // return formattedData;
    const completedLessonsMap = new Map(
      completedLessonsData.map((data) => [data.userId, data]),
    );

    // Format the data for all users
    const formattedData = allUsers.map((user) => {
      const completedData = completedLessonsMap.get(user.user_id);

      return {
        ...user,
        lessonIds: completedData
          ? completedData.lessonIds.map((lessonId, index) => [
              lessonId.toString(),
              completedData.createdAtArray[index],
            ])
          : [],
      };
    });

    return formattedData;
  }

  /**
   * Retrieves the Leaderboard data for last week with .
   * @returns An array of User records with daily lessons.
   */
  async calculateLeaderBoardPercentage() {
    const getLeaderboardData = await this.getLeaderboardDataService();

    const leaderBoardWithPercentage = await Promise.all(
      getLeaderboardData.map(async (entry) => {
        if (entry.lessonIds.length === 0) {
          return {
            ...entry,
            lessonCompleted: 0,
            average_completion_time: 0,
          };
        }

        const lessonIdsIndex = entry.lessonIds.map((item) => item[0]);

        const completedLessons = await this.userLessonProgressRepository
          .createQueryBuilder('userLessonProgress')
          .where('userLessonProgress.user_id =:userId', {
            userId: entry.user_id,
          })
          .andWhere('userLessonProgress.lesson_id IN (:...lessonIds)', {
            lessonIds: lessonIdsIndex,
          })
          .getMany();
        const totalOpeningTime = completedLessons
          .map((completedLesson) => {
            const lessonIndex = entry.lessonIds.find(
              (item) => item[0] === String(completedLesson.lesson_id),
            );
            if (!lessonIndex) return 0;

            const LessonOpeningTime = new Date(lessonIndex[1]).getTime();
            const completionTime = new Date(
              completedLesson.completed_date,
            ).getTime();
            return completionTime - LessonOpeningTime;
          })
          .reduce((acc, openTime) => acc + openTime, 0);

        const averageCompletionTime =
          completedLessons.length > 0
            ? totalOpeningTime / completedLessons.length / 1000 / 60
            : 0;

        return {
          ...entry,
          lessonCompleted: completedLessons.length,
          average_completion_time: +averageCompletionTime.toFixed(2),
        };
      }),
    );

    leaderBoardWithPercentage.sort((a, b) => {
      // Sort by lessonCompleted (higher is better)
      if (b.lessonCompleted !== a.lessonCompleted) {
        return b.lessonCompleted - a.lessonCompleted;
      }
      // If lessonCompleted is the same, sort by average_completion_time (lower is better)
      return a.average_completion_time - b.average_completion_time;
    });

    return { leaderBoardWithPercentage };
  }
  // create leaderboard entry once a week using cron job
  async createLeaderboardEntry() {
    const LeaderboardData = await this.calculateLeaderBoardPercentage();
    const leaderboardEntry = LeaderboardData.leaderBoardWithPercentage.map(
      (entry, index) =>
        this.leaderboardRepository.create({
          userId: entry.user_id,
          lessonsCompleted: entry.lessonCompleted,
          rank: index + 1,
        }),
    );

    return this.leaderboardRepository.save(leaderboardEntry);
  }

  async getLeaderboardData(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.leaderboardRepository.findAndCount({
      skip,
      take: limit,
      order: {
        rank: 'ASC',
      },
      relations: ['user'],
    });

    return {
      items,
      total,
      currentPage: page,
      hasMore: skip + items.length < total,
    };
  }
}
