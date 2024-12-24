import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLessonProgressEntity } from '@src/entities/user-lesson-progress.entity';
import { CourseEntity, LessonEntity, LessonTokenEntity } from '@src/entities';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(UserLessonProgressEntity)
    private userLessonProgressRepository: Repository<UserLessonProgressEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
  ) {}

  async markLessonAsCompleted(
    userId: number,
    lessonId: number,
    courseId: number,
  ): Promise<UserLessonProgressEntity> {
    // Verify the lesson exists and belongs to the course
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, course_id: courseId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found in this course');
    }

    // Check if progress already exists
    const existingProgress = await this.userLessonProgressRepository.findOne({
      where: {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
      },
    });

    if (existingProgress) {
      // throw new ConflictException('Lesson already marked as completed');
      // DELETE MARKED AS COMPLETED RECORD
      await this.userLessonProgressRepository.delete(existingProgress.id);
    } else {
      // DELETE MARKED AS COMPLETED RECORD
      // Create new progress entry
      const progress = this.userLessonProgressRepository.create({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed_date: new Date(),
      });

      return await this.userLessonProgressRepository.save(progress);
    }
  }

  async getLessonProgressArray(
    userId: number,
    courseId: number,
  ): Promise<{ lesson_id: number; completed_date: Date | null }[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

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

    // Group lessons by course_id
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

    // Convert the grouped data to the desired format
    const userProgress = Object.entries(courseProgressMap).map(
      ([course_id, lessons]) => ({
        course_id: Number(course_id),
        lessons,
      }),
    );

    return userProgress;
  }

  async checkLessonRead(
    userId: number,
    lessonId: number,
  ): Promise<{ isRead: boolean; completed_date: Date | null }> {
    // Check if the lesson exists for the user
    const lessonProgress = await this.userLessonProgressRepository.findOne({
      where: {
        user_id: userId,
        lesson_id: lessonId,
      },
      select: ['id', 'completed_date'], // Fetch only the necessary field for existence check
    });

    // Return true if the lesson exists, false otherwise
    return {
      isRead: !!lessonProgress,
      completed_date: lessonProgress?.completed_date
        ? lessonProgress?.completed_date
        : null,
    };
  }

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
