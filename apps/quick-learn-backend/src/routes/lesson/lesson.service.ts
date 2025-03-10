import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services';
import { FlaggedLessonEntity, LessonEntity, UserEntity } from '@src/entities';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { CourseService } from '../course/course.service';
import { en } from '@src/lang/en';
import { UserTypeIdEnum } from '@quick-learn/shared';
import { PaginationDto } from '../users/dto';
import { IDailyLessonTokenData, PaginatedResult } from '@src/common/interfaces';
import { Repository, ILike, MoreThan, FindOptionsWhere } from 'typeorm';
import Helpers from '@src/common/utils/helper';
import { FileService } from '@src/file/file.service';
import { DailyLessonEnum } from '@src/common/enum/daily_lesson.enum';
import { FlaggedLessonService } from './flagged-lesson.service';
import { LessonTokenService } from '@src/common/modules/lesson-token/lesson-token.service';
import { AuthService } from '../auth/auth.service';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';

interface IDailyLessonDetails {
  lesson_detail: LessonEntity;
  user_detail: UserEntity;
  user_lesson_read_info: { isRead: boolean; completed_date: Date | null };
}

@Injectable()
export class LessonService extends PaginationService<LessonEntity> {
  constructor(
    @InjectRepository(LessonEntity)
    repo: Repository<LessonEntity>,
    private readonly authService: AuthService,
    private readonly lessonTokenService: LessonTokenService,
    private readonly lessonProgressService: LessonProgressService,
    private readonly flaggedLessionService: FlaggedLessonService,
    private readonly courseService: CourseService,
    private readonly FileService: FileService,
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
    const lesson = await this.get({ id });
    if (!lesson) throw new BadRequestException(en.lessonNotFound);

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

    if (UrlsToBeDeletedFromBucket.length) {
      await this.FileService.deleteFiles(UrlsToBeDeletedFromBucket);
    }

    let payload: Partial<LessonEntity> = {
      name: updateLessonDto.name || lesson.name,
      new_content: updateLessonDto.content,
      approved: false,
    };

    // If user is admin, auto-approve the lesson
    const isAdmin = [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
      user.user_type_id,
    );
    if (isAdmin) {
      payload = {
        ...payload,
        approved: true,
        approved_by: user.id,
        content: updateLessonDto.content,
        new_content: '',
      };
    }
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
      .leftJoinAndSelect('lesson.created_by_user', 'created_by_user')
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
  async getUnapprovedLessons(page = 1, limit = 10, q = '') {
    let options:
      | FindOptionsWhere<LessonEntity>
      | FindOptionsWhere<LessonEntity>[] = {
      archived: false,
      approved: false,
      course: {
        archived: false,
      },
    };

    if (q) {
      options = [
        {
          ...options,
          name: ILike(`%${q}%`),
        },
        {
          ...options,
          created_by_user: {
            full_name: ILike(`%${q}%`),
          },
        },
      ];
    }

    return await this.paginate(
      {
        page,
        limit,
      },
      options,
      ['created_by_user', 'course'],
    );
  }

  async updateDailyLessonToken(
    token: string,
    course_id: number,
    lesson_id: number,
  ) {
    await this.lessonTokenService.update(
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

  async getSearchedLessons(userId: number, isMember = false, query = '') {
    const queryBuilder = this.repository
      .createQueryBuilder('lesson')
      .andWhere('lesson.approved= :approved', { approved: true })
      .andWhere('lesson.archived = :lessonArchived', { lessonArchived: false })
      .leftJoin(
        'lesson.course',
        'course',
        'course.archived = :courseArchived',
        { courseArchived: false },
      )
      .andWhere('lesson.name ILIKE :query', { query: `%${query}%` });

    if (isMember) {
      queryBuilder
        .innerJoin('course.roadmaps', 'roadmaps')
        .innerJoin('roadmaps.users', 'users')
        .andWhere('users.id = :userId', { userId });
    }

    return queryBuilder
      .select([
        'lesson.id AS id',
        'lesson.name AS name',
        'course.id AS course_id',
        'course.name AS course_name',
      ])
      .groupBy('lesson.id')
      .addGroupBy('lesson.name')
      .addGroupBy('course.id')
      .limit(3)
      .getRawMany(); // Changed from getMany() to getRawMany()
  }

  async fetchLesson(lessonId: number, courseId: number) {
    return await this.repository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.flagged_lesson', 'flagged_lesson')
      .leftJoinAndSelect('flagged_lesson.user', 'flagged_by_user')
      .where('lesson.id = :id', { id: lessonId })
      .andWhere('course.id = :courseId', { courseId })
      .andWhere('lesson.archived = :archived', { archived: false })
      .andWhere('lesson.approved = :approved', { approved: true })
      .andWhere('course.archived = :courseArchived', { courseArchived: false })
      .getOne();
  }

  async flagLesson(token: string) {
    const data = await this.authService.getTokenDetails(token);
    // Find the lesson token entry using the token
    const lessonToken = await this.lessonTokenService.get(
      { token: (data as IDailyLessonTokenData).token },
      ['user'], // Include relations if needed
    );

    if (!lessonToken) {
      throw new Error('Lesson token not found');
    }

    // Create new flagged lesson entry
    return await this.flaggedLessionService.create({
      user_id: lessonToken.user_id,
      lesson_id: lessonToken.lesson_id,
      course_id: lessonToken.course_id,
    });
  }

  async findAllFlaggedLesson(
    page = 1,
    limit = 10,
    search = '',
  ): Promise<PaginatedResult<FlaggedLessonEntity>> {
    // Add search condition if search term exists
    let findOptions:
      | FindOptionsWhere<FlaggedLessonEntity>
      | FindOptionsWhere<FlaggedLessonEntity>[] = {
      lesson: {
        archived: false,
      },
      course: {
        archived: false,
      },
    };
    if (search) {
      findOptions = [
        {
          ...findOptions,
          lesson: {
            name: ILike(`%${search}%`),
            archived: false,
          },
        },
        {
          ...findOptions,
          user: {
            full_name: ILike(`%${search}%`),
          },
        },
      ];
    }

    return await this.flaggedLessionService.paginate(
      { page, limit },
      findOptions,
      ['user', 'lesson', 'course'],
      { id: 'DESC' },
    );
  }

  async getDailyLessonFromToken(token: string): Promise<IDailyLessonDetails> {
    const data = await this.authService.getTokenDetails(token);
    const userTokenDetail = await this.lessonTokenService.validateLessionToken(
      data as unknown as IDailyLessonTokenData,
    );
    const {
      lesson_id,
      course_id,
      token: hashedToken,
    } = data as IDailyLessonTokenData;
    const [userLessonReadInfo, lessonDetail] = await Promise.all([
      await this.lessonProgressService.checkLessonRead(
        userTokenDetail.user.id,
        +lesson_id,
      ),
      await this.fetchLesson(+lesson_id, +course_id),
      await this.updateDailyLessonToken(hashedToken, +course_id, +lesson_id),
    ]);

    console.log('lessonDetail', lessonDetail, +lesson_id, +course_id);

    return {
      lesson_detail: lessonDetail,
      user_lesson_read_info: userLessonReadInfo,
      user_detail: userTokenDetail.user,
    };
  }

  async unFlagLesson(id: number): Promise<void> {
    const isValid = await this.flaggedLessionService.get({ lesson_id: id });

    if (!isValid) throw new BadRequestException(en.invalidLesson);

    await this.flaggedLessionService.delete({ lesson_id: id });
  }

  async getUnApprovedLessonCount() {
    return await this.count(
      {
        archived: false,
        approved: false,
        course: {
          archived: false,
        },
      },
      ['course'],
    );
  }

  async getFlaggedLessonCount() {
    return await this.count(
      {
        archived: false,
        flagged_lesson: {
          id: MoreThan(0),
        },
        course: {
          archived: false,
        },
      },
      ['flagged_lesson'],
    );
  }
}
