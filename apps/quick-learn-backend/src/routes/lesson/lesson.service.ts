import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services';
import { LessonEntity, LessonTokenEntity, UserEntity } from '@src/entities';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { CourseService } from '../course/course.service';
import { en } from '@src/lang/en';
import { UserTypeIdEnum } from '@quick-learn/shared';
import { PaginationDto } from '../users/dto';
import { PaginatedResult } from '@src/common/interfaces';
import { Repository } from 'typeorm';
import Helpers from '@src/common/utils/helper';
import { FileService } from '@src/file/file.service';
import { DailyLessonEnum } from '@src/common/enum/daily_lesson.enum';
@Injectable()
export class LessonService extends PaginationService<LessonEntity> {
  constructor(
    @InjectRepository(LessonEntity) repo: Repository<LessonEntity>,
    private courseService: CourseService,
    private readonly FileService: FileService,
    @InjectRepository(LessonTokenEntity)
    private LessonTokenRepository: Repository<LessonTokenEntity>,
  ) {
    super(repo);
  }
  /**
   * Get a lesson
   * @param LessonId - The id of the Lesson
   * @throws BadRequestException if the course doesn't exist
   * @returns The lesson entity
   */
  private async getLesson(lessonId: number): Promise<LessonEntity> {
    const lesson = await this.repository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }
    return lesson;
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
    const lesson = await this.getLesson(id);

    const existingContentImageUrl = Helpers.extractImageUrlsFromHtml(
      lesson.content,
      undefined,
      true,
    );

    const incomingContentImageUrl = Helpers.extractImageUrlsFromHtml(
      updateLessonDto.content,
      undefined,
      true,
    );

    const UrlsToBeDeletedFromBucket = existingContentImageUrl.filter(
      (urls) => !incomingContentImageUrl.includes(urls),
    );

    if (UrlsToBeDeletedFromBucket && UrlsToBeDeletedFromBucket.length) {
      await this.FileService.deleteFiles(UrlsToBeDeletedFromBucket);
    }

    let payload: Partial<LessonEntity> = {
      name: updateLessonDto.name || lesson.name,
      new_content: updateLessonDto.content,
      approved: false,
    };

    // checking if the user is admin or not
    // if user is admin then approve the lesson
    const checkUserAdminOrNot = [
      UserTypeIdEnum.SUPERADMIN,
      UserTypeIdEnum.ADMIN,
    ].includes(user.user_type_id);
    if (checkUserAdminOrNot) {
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
    const lesson = await this.getLesson(lessonId);

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
  ): Promise<PaginatedResult<LessonEntity>> {
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
      limit,
    };
  }

  /**
   * Unarchives an existing lesson
   * @param lessonId - The id of the lesson that needs to be unarchived
   * @param userId - The id of the user unarchiving the lesson
   * @throws BadRequestException if the lesson doesn't exist
   */
  async unarchiveLesson(lessonId: LessonEntity['id']) {
    await this.getLesson(lessonId);

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

  /**
   * Permanently deletes a lesson
   * @param id - The id of the lesson to delete
   * @throws BadRequestException if the lesson doesn't exist
   */
  async deleteLesson(id: number): Promise<void> {
    const lesson = await this.getLesson(id);

    const existingContentImageUrl = Helpers.extractImageUrlsFromHtml(
      lesson.content,
      undefined,
      true,
    );

    const compareImgUrlLength =
      existingContentImageUrl && existingContentImageUrl.length;
    if (compareImgUrlLength) {
      await this.FileService.deleteFiles(existingContentImageUrl);
    }

    await this.repository.delete({ id });
  }

  /**
   * Gets a lesson by id, with user and course details
   * @param userId - The id of the user
   * @param id - The id of the lesson
   * @param courseId - The id of the course
   * @param roadmap - The id of the roadmap the lesson belongs to
   * @returns A LessonEntity
   */
  async getUserLessonDetails(
    userId: number,
    id: number,
    courseId: number,
    roadmap?: number,
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .innerJoinAndSelect('lesson.created_by_user', 'created_by_user')
      .leftJoin('course.roadmaps', 'roadmaps')
      .innerJoin('roadmaps.users', 'users')
      .where('lesson.id = :id', { id })
      .andWhere('course.id = :courseId', { courseId })
      .andWhere('lesson.archived = :archived', { archived: false })
      .andWhere('lesson.approved = :approved', { approved: true })
      .andWhere('course.archived = :courseArchived', { courseArchived: false })
      .andWhere('users.id = :userId', { userId });

    if (roadmap) {
      queryBuilder
        .addSelect('roadmaps')
        .andWhere('roadmaps.id = :roadmapId', { roadmapId: roadmap });
    }

    return await queryBuilder.getOne();
  }

  /**
   * Retrieves all unapproved lessons
   * @returns A promise that resolves to a list of LessonEntity
   */
  async getUnapprovedLessons(): Promise<LessonEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('lesson')
      .innerJoinAndSelect('lesson.created_by_user', 'created_by_user')
      .innerJoin('lesson.course', 'course')
      .where('course.archived = :courseArchived', { courseArchived: false })
      .andWhere('lesson.archived = :archived', { archived: false })
      .andWhere('lesson.approved = :approved', { approved: false });

    return await queryBuilder.getMany();
  }

  async validateLessionToken(
    token: string,
    course_id: number,
    lesson_id: number,
  ) {
    // VALIDATE TOKEN
    if (!token) {
      throw new BadRequestException(en.lessonTokenRequired);
    }

    const tokenEntity = await this.LessonTokenRepository.findOne({
      where: {
        token,
        course_id,
        lesson_id,
      },
      relations: ['user'],
    });
    if (!tokenEntity) {
      throw new BadRequestException(en.invalidLessonToken);
    }

    // CHECK IF TOKEN IS VALID
    if (token !== tokenEntity.token) {
      throw new BadRequestException(en.invalidLessonToken);
    }

    // CHECK IF TOKEN HAS EXPIRED
    if (tokenEntity.expiresAt < new Date()) {
      throw new BadRequestException(en.lessonTokenExpired);
    }

    return tokenEntity;
  }

  async fetchLesson(lessonId: number, courseId: number) {
    const lessonDetail = await this.repository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .innerJoinAndSelect('lesson.created_by_user', 'created_by_user')
      .leftJoin('course.roadmaps', 'roadmaps')
      .innerJoin('roadmaps.users', 'users')
      .where('lesson.id = :id', { id: lessonId })
      .andWhere('course.id = :courseId', { courseId })
      .andWhere('lesson.archived = :archived', { archived: false })
      .andWhere('lesson.approved = :approved', { approved: true })
      .andWhere('course.archived = :courseArchived', { courseArchived: false })
      .getOne();
    return lessonDetail;
  }

  async updateDailyLessonToken(
    token: string,
    course_id: number,
    lesson_id: number,
  ) {
    await this.LessonTokenRepository.update(
      {
        course_id: course_id,
        lesson_id: lesson_id,
        token: token,
        status: DailyLessonEnum.PENDING,
      },
      {
        status: DailyLessonEnum.COMPLETED,
      },
    );
  }
}
