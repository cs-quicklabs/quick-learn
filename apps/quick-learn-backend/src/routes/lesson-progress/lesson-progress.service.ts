import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLessonProgressEntity } from '@src/entities/user-lesson-progress.entity';
import { CourseEntity, LessonEntity, LessonTokenEntity } from '@src/entities';
import { en } from '@src/lang/en';
@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(UserLessonProgressEntity)
    private userLessonProgressRepository: Repository<UserLessonProgressEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(LessonTokenEntity)
    private LessonTokenRepository: Repository<LessonTokenEntity>,
  ) {}

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
<<<<<<< HEAD
    await this.validateLesson(lessonId, courseId);

=======
    const lessonExists = await this.lessonRepository.findOne({
      where: { id: lessonId, course_id: courseId },
    });

    if (!lessonExists) {
      throw new NotFoundException(en.lessonNotFoundInCourse);
    }
>>>>>>> dev
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
}
