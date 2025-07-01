import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLessonProgressEntity } from '@src/entities/user-lesson-progress.entity';
import { BasicCrudService } from '@src/common/services';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import {
  getLastMonthRange,
  getLastQuarterRange,
  getLastWeekRange,
} from '@quick-learn/shared';
import { CourseService } from '../course/course.service';
import { LessonTokenService } from '@src/common/modules/lesson-token/lesson-token.service';
@Injectable()
export class LessonProgressService extends BasicCrudService<UserLessonProgressEntity> {
  constructor(
    @InjectRepository(UserLessonProgressEntity)
    repo: Repository<UserLessonProgressEntity>,
    private readonly lessonTokenService: LessonTokenService,
    private readonly courseService: CourseService,
  ) {
    super(repo);
  }

  private async validateLesson(lessonId: number, courseId: number) {
    // Checking this through course to avoid circular dependencies
    const course = await this.courseService.get(
      { lessons: { id: lessonId }, id: courseId },
      ['lessons'],
    );

    if (!course) {
      throw new NotFoundException('Lesson not found in this course');
    }
    // if lesson is there then it will be always at 0th index
    return course.lessons[0];
  }

  private async validateCourse(courseId: number) {
    const course = await this.courseService.get({ id: courseId });

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
    user: number,
  ): Promise<UserLessonProgressEntity> {
    await this.validateLesson(lessonId, courseId);

    const existingProgress = await this.get({
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
      team_id: user,
    });

    if (existingProgress) {
      await this.delete({ id: existingProgress.id });
    } else {
      return await this.create({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed_date: new Date(),
        team_id: user,
      });
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

    const completedLessons = await this.repository.find({
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
    const completedLessons = await this.repository
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
    const checkLessonExist = await this.repository.findOne({
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
    return await this.lessonTokenService.getAllTokenByUserId(userId);
  }

  async getAllUserProgressData(range: { start: string; end: string }) {
    return await this.lessonTokenService.getUsersTokenBetweenDates(range);
  }

  async getAllUserCompletedLessonData(range: { start: string; end: string }) {
    return await this.lessonTokenService.getCompletedToken(range);
  }

  getDateToFindFrom(type: LeaderboardTypeEnum): { start: string; end: string } {
    switch (type) {
      case LeaderboardTypeEnum.MONTHLY:
        return getLastMonthRange();
      case LeaderboardTypeEnum.QUARTERLY:
        return getLastQuarterRange();
      default:
        return getLastWeekRange();
    }
  }

  async getLeaderboardDataService(type: LeaderboardTypeEnum) {
    const dateToFindFrom = this.getDateToFindFrom(type);

    //get all user with completed lessons
    const allUsers = await this.getAllUserProgressData(dateToFindFrom);

    const completedLessonsData =
      await this.getAllUserCompletedLessonData(dateToFindFrom);

    // return formattedData;
    const completedLessonsMap = new Map(
      completedLessonsData.map((data) => [data.userId, data]),
    );

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
  async calculateLeaderBoardPercentage(type: LeaderboardTypeEnum) {
    const getLeaderboardData = await this.getLeaderboardDataService(type);

    const leaderBoardWithPercentage = await Promise.all(
      getLeaderboardData.map(async (entry) => {
        if (entry.lessonIds.length === 0) {
          return {
            ...entry,
            lesson_completed_count: 0,
            average_completion_time: 0,
          };
        }

        const lessonIdsIndex = entry.lessonIds.map((item) => item[0]);

        const dateToFindFrom = this.getDateToFindFrom(type);

        const completedLessons = await this.repository
          .createQueryBuilder('userLessonProgress')
          .withDeleted()
          .where('userLessonProgress.user_id = :userId', {
            userId: entry.user_id,
          })
          .andWhere('userLessonProgress.lesson_id IN (:...lessonIds)', {
            lessonIds: lessonIdsIndex,
          })
          .andWhere('userLessonProgress.completed_date >= :start', {
            start: dateToFindFrom.start,
          })
          .andWhere('userLessonProgress.completed_date <= :end', {
            end: dateToFindFrom.end,
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
          lesson_completed_count: completedLessons.length,
          average_completion_time: +averageCompletionTime.toFixed(2),
        };
      }),
    );

    leaderBoardWithPercentage.sort((a, b) => {
      // Sort by lessonCompleted (higher is better)
      if (b.lesson_completed_count !== a.lesson_completed_count) {
        return b.lesson_completed_count - a.lesson_completed_count;
      }
      // If lessonCompleted is the same, sort by average_completion_time (lower is better)
      return a.average_completion_time - b.average_completion_time;
    });

    return leaderBoardWithPercentage;
  }

  async resetUserReadingHistory(userID: number) {
    try {
      await this.repository.softDelete({ user_id: userID });
    } catch (error) {
      console.error(`Error resetting history for user ${userID}`, error);
      throw error;
    }
  }
}
