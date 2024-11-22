import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLessonProgressEntity } from '@src/entities/user-lesson-progress.entity';
import { CourseEntity, LessonEntity } from '@src/entities';

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
      throw new ConflictException('Lesson already marked as completed');
    }

    // Create new progress entry
    const progress = this.userLessonProgressRepository.create({
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
      completed_date: new Date(),
    });

    return await this.userLessonProgressRepository.save(progress);
  }

  async getLessonProgress(
    userId: number,
    courseId: number,
  ): Promise<{ total: number; completed: number; percentage: number }> {
    // Verify the course exists
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const [completedLessons, totalLessons] = await Promise.all([
      this.userLessonProgressRepository.count({
        where: {
          user_id: userId,
          course_id: courseId,
        },
      }),
      this.lessonRepository.count({
        where: {
          course_id: courseId,
        },
      }),
    ]);

    return {
      total: totalLessons,
      completed: completedLessons,
      percentage:
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    };
  }

  async getUserLessonStatus(
    userId: number,
    courseId: number,
  ): Promise<
    { lessonId: number; completed: boolean; completedDate: Date | null }[]
  > {
    const lessons = await this.lessonRepository.find({
      where: { course_id: courseId },
    });

    const progress = await this.userLessonProgressRepository.find({
      where: {
        user_id: userId,
        course_id: courseId,
      },
    });

    return lessons.map((lesson) => ({
      lessonId: lesson.id,
      completed: progress.some((p) => p.lesson_id === lesson.id),
      completedDate:
        progress.find((p) => p.lesson_id === lesson.id)?.completed_date || null,
    }));
  }
}
