import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services';
import { LessonEntity, UserEntity } from '@src/entities';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { CourseService } from '../course/course.service';
import { en } from '@src/lang/en';
import { UserTypeIdEnum } from '@quick-learn/shared';
import { PaginationDto } from '../users/dto';

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
   * Gets archived lessons with pagination
   * @param paginationDto - Pagination parameters
   * @param relations - Relations to include in the query
   * @returns Paginated list of archived lessons
   */
  async getArchivedLessons(
    paginationDto: PaginationDto,
    relations: string[] = [],
  ): Promise<{
    items: LessonEntity[];
    total: number;
    page: number;
    total_pages: number;
  }> {
    const { page = 1, limit = 10, q = '' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('lesson')
      .where('lesson.archived = :archived', { archived: true });

    // Join all relations
    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`lesson.${relation}`, relation);
    });

    if (q) {
      queryBuilder.andWhere(
        '(lesson.name ILIKE :search OR ' +
          'lesson.content ILIKE :search OR ' +
          'course.name ILIKE :search)',
        { search: `%${q}%` },
      );
    }

    queryBuilder.orderBy('lesson.updated_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Unarchives an existing lesson
   * @param lessonId - The id of the lesson that needs to be unarchived
   * @param userId - The id of the user unarchiving the lesson
   * @throws BadRequestException if the lesson doesn't exist
   */
  async unarchiveLesson(
    lessonId: LessonEntity['id'],
    userId: UserEntity['id'],
  ) {
    const lesson = await this.get({ id: lessonId });
    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }

    await this.update(
      { id: lessonId },
      {
        archive_by: null,
        archived: false,
      },
    );
  }

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
