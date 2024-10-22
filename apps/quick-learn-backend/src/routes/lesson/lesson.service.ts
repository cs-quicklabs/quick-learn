import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services';
import { LessonEntity, UserEntity } from '@src/entities';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { CourseService } from '../course/course.service';
import { en } from '@src/lang/en';
import { UserTypeIdEnum } from '@quick-learn/shared';

@Injectable()
export class LessonService extends PaginationService<LessonEntity> {
  constructor(
    @InjectRepository(LessonEntity) repo,
    private courseService: CourseService,
  ) {
    super(repo);
  }

  /**
   * Creates a new lesson
   * @param userId - The id of the user who is creating the lesson
   * @param CreateLessonDto - The data for creating the lesson
   * @throws BadRequestException if the course doesn't exist
   * @returns The created lesson entity
   */
  async createLesson(user: UserEntity, payload: CreateLessonDto) {
    const course = await this.courseService.get({ id: +payload.course_id });

    if (!course) {
      throw new BadRequestException(en.invalidCourse);
    }

    let lesson: Partial<LessonEntity> = Object.assign(new LessonEntity(), {
      ...payload,
      new_content: payload.content,
      content: '',
      created_by: user.id,
    });

    // checking if the user is admin or not
    // if user is admin then approve the lesson
    if (
      [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
        user.user_type_id,
      )
    ) {
      lesson = {
        ...lesson,
        approved: true,
        approved_by: user.id,
        content: payload.content,
        new_content: '',
      };
    }

    await this.repository.save(lesson);
  }

  /**
   * Updates an existing lesson
   * @param id - The id of the lesson that needs to be updated
   * @param UpdateLessonDto - The data for updating the lesson
   * @throws BadRequestException if the lesson doesn't exist
   * @returns nothing
   */
  async updateLesson(
    user: UserEntity,
    id: LessonEntity['id'],
    updateLessonDto: UpdateLessonDto,
  ) {
    const lesson = await this.get({ id });

    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }

    let payload: Partial<LessonEntity> = {
      name: updateLessonDto.name || lesson.name,
      new_content: updateLessonDto.content,
      approved: false,
    };

    // checking if the user is admin or not
    // if user is admin then approve the lesson
    if (
      [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
        user.user_type_id,
      )
    ) {
      payload = {
        ...payload,
        approved: true,
        approved_by: user.id,
        content: updateLessonDto.content,
        new_content: '',
      };
    }

    //  update the lesson and mark lesson as unapproved.
    await this.update({ id }, payload);
  }

  /**
   * Approves an existing lesson
   * @param userId - The id of the user approving the lesson
   * @param lessonId - The id of the lesson that needs to be approved
   * @throws BadRequestException if the lesson doesn't exist
   * @returns nothing
   */
  async approveLesson(lessonId: LessonEntity['id'], userId: UserEntity['id']) {
    const lesson = await this.get({ id: lessonId });
    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }
    await this.update(
      { id: lessonId },
      {
        approved_by: userId,
        approved: true,
        content: lesson.new_content,
        new_content: '',
      },
    );
  }

  /**
   * Archives an existing lesson
   * @param userId - The id of the user archiving the lesson
   * @param lessonId - The id of the lesson that needs to be archived
   * @throws BadRequestException if the lesson doesn't exist
   * @returns nothing
   */
  async archiveLesson(userId: UserEntity['id'], lessonId: LessonEntity['id']) {
    const lesson = await this.get({ id: lessonId });
    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }
    await this.update(
      { id: lessonId },
      {
        archive_by: userId,
        archived: true,
      },
    );
  }
}
