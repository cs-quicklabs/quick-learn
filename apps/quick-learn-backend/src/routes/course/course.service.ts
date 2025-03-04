import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';
import { PaginationService } from '@src/common/services';
import { CourseEntity, UserEntity, LessonEntity } from '@src/entities';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseCategoryService } from '../course-category/course-category.service';
import { RoadmapService } from '../roadmap/roadmap.service';
import { en } from '@src/lang/en';
import { AssignRoadmapsToCourseDto } from './dto/assign-roadmaps-to-course.dto';
import Helpers from '@src/common/utils/helper';
import { PaginationDto } from '../users/dto';
import { PaginatedResult } from '@src/common/interfaces';
import { FileService } from '@src/file/file.service';

const courseRelations = ['roadmaps', 'course_category', 'created_by'];

@Injectable()
export class CourseService extends PaginationService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity) repo,
    @Inject(forwardRef(() => RoadmapService))
    private readonly roadmapService: RoadmapService,
    private readonly courseCategoryService: CourseCategoryService,
    private readonly FileService: FileService,
  ) {
    super(repo);
  }

  async getContentRepoCourses(
    paginationDto: PaginationDto,
    options: FindOptionsWhere<CourseEntity>, // filter conditions
    relations: string[] = [], // additional relations to include
  ): Promise<PaginatedResult<CourseEntity> | CourseEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('courses');
    const { page, limit, mode } = paginationDto;
    // Apply filters from options
    if (options) {
      Object.keys(options).forEach((key) => {
        queryBuilder.andWhere(`courses.${key} = :${key}`, {
          [key]: options[key],
        });
      });
    }

    // Dynamically include relations
    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`courses.${relation}`, relation);
    });

    // Join course_category and count lessons
    queryBuilder
      .leftJoin('courses.lessons', 'lessons')
      .loadRelationCountAndMap(
        'courses.lessons_count',
        'courses.lessons',
        'lessons',
        (qb) =>
          qb
            .andWhere('lessons.archived = :archivedLessons', {
              archivedLessons: false,
            })
            .andWhere('lessons.approved = :approvedLessons', {
              approvedLessons: true,
            }),
      )
      .orderBy('courses.name', 'ASC');

    if (mode === 'paginate') {
      return await this.queryBuilderPaginate(queryBuilder, page, limit);
    } else {
      return await queryBuilder.getMany();
    }
  }

  /**
   * Creates a new course.
   * @param user - The user creating the course.
   * @param createCourseDto - The data for creating the course.
   * @returns A promise that resolves to the created course entity.
   * @throws Error if the course category is invalid.
   * @throws Error if the roadmap is invalid.
   * @throws BadRequestException if a course with the same name already exists.
   */
  async createCourse(
    user: UserEntity,
    createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    const course = await this.get({ name: ILike(createCourseDto.name) });

    if (course) {
      throw new BadRequestException(en.courseAlreadyExists);
    }

    const courseCategory = await this.courseCategoryService.get({
      id: +createCourseDto.course_category_id,
    });

    if (!courseCategory) {
      throw new BadRequestException(en.InvalidCourseCategory);
    }

    const roadmap = await this.roadmapService.get({
      id: +createCourseDto.roadmap_id,
    });

    if (!roadmap) {
      throw new BadRequestException(en.InvalidRoadmap);
    }

    return await this.create({
      ...createCourseDto,
      roadmaps: [roadmap],
      course_category_id: courseCategory.id,
      created_by_user_id: user.id,
    });
  }

  /**
   * Gets course details with specified relations
   */
  async getCourseDetails(
    options: FindOptionsWhere<CourseEntity>,
    relations: string[] = [],
    conditions?: { countParticipant?: boolean; isCommunity?: boolean },
  ): Promise<CourseEntity> {
    let sort: FindOptionsOrder<CourseEntity>;
    if (relations.includes('lessons')) {
      sort = {
        lessons: {
          updated_at: 'DESC',
        },
      };
    }
    const course = await this.repository.findOne({
      where: { ...options },
      relations: [...courseRelations, ...relations],
      order: sort,
    });

    if (!course) {
      throw new BadRequestException(en.invalidCourse);
    }
    if (conditions?.countParticipant) {
      const courseCount = await this.getCourseParticipantCount(course.id);
      course['userCount'] = courseCount;
    }

    if (!course.lessons) {
      course.lessons = [];
    } else {
      // Filter and sanitize lessons using helper function
      const archived = false;
      const approved = conditions?.isCommunity ? true : null; // Only consider approval for community lessons

      course.lessons = await this.filterSanitisedLessons(course.lessons, {
        archived: archived,
        approved: approved,
      });
    }

    return course;
  }

  private async filterSanitisedLessons(
    lessons: LessonEntity[],
    conditions: { archived: boolean; approved?: boolean | null },
  ): Promise<LessonEntity[]> {
    return lessons
      .filter(
        (lesson) =>
          lesson.archived === conditions.archived &&
          (conditions.approved === null ||
            lesson.approved === conditions.approved),
      )
      .map((lesson) => {
        // Sanitize content while keeping the original instance
        lesson.content = Helpers.limitSanitizedContent(lesson.content);
        return lesson; // Return the original entity instance
      });
  }

  async getCourseParticipantCount(id: number) {
    const queryBuilder = this.repository
      .createQueryBuilder('course')
      .leftJoin('course.roadmaps', 'roadmap')
      .leftJoin('roadmap.users', 'user', 'user.active= :ActiveUser', {
        ActiveUser: true,
      })
      .where('course.id = :courseId', { courseId: id })
      .select('COUNT(DISTINCT user.id)', 'userCount');

    const result = await queryBuilder.getRawOne();
    return result?.userCount || 0;
  }

  /**
   * Gets course details from assigned roadmaps
   */
  async getUserAssignedRoadmapCourses(userId: number): Promise<CourseEntity[]> {
    return await this.repository
      .createQueryBuilder('course')
      .innerJoin('course.roadmaps', 'roadmap')
      .innerJoin('user_roadmaps', 'ur', 'ur.roadmap_id = roadmap.id')
      .where('ur.user_id = :userId', { userId })
      .andWhere('course.archived = :archived', { archived: false })
      .leftJoin('course.lessons', 'lesson')
      .loadRelationCountAndMap(
        'course.lessonCount',
        'course.lessons',
        'lesson',
        (qb) => qb.andWhere('lesson.archived = :archived', { archived: false }),
      )
      .getMany();
  }

  /**
   * Gets lessions details within cource with relations
   */
  async getImagesUsedInLessonsRelatedCource(
    options: FindOptionsWhere<CourseEntity>,
    relations: string[] = [],
  ): Promise<string[]> {
    const course = await this.repository.findOne({
      where: { ...options },
      relations: [...courseRelations, ...relations],
      order: {
        lessons: {
          updated_at: 'DESC',
        },
      },
    });

    if (!course) {
      throw new BadRequestException(en.invalidCourse);
    }

    let imageToDelete: string[] = [];
    if (!course.lessons) {
      return imageToDelete;
    } else {
      imageToDelete = Helpers.extractImageUrlsFromHtml(
        course.lessons as [],
        'content',
        false,
      );
      return imageToDelete;
    }
  }

  async updateCourse(
    id: number,
    updateCourseDto: Partial<CourseEntity>,
  ): Promise<void> {
    const course = await this.getCourseDetails({ id });
    let courseByname: CourseEntity;

    if (updateCourseDto?.name) {
      courseByname = await this.get({
        name: ILike(updateCourseDto.name),
      });
    }

    if (!course) {
      throw new BadRequestException(en.CourseNotFound);
    }

    const checkCourseNameIdNotEqual =
      courseByname && courseByname.id !== course.id;
    if (checkCourseNameIdNotEqual) {
      throw new BadRequestException(en.courseAlreadyExists);
    }

    const courseCategoryExist = updateCourseDto?.course_category_id;
    if (courseCategoryExist) {
      const courseCategory = await this.courseCategoryService.get({
        id: +updateCourseDto.course_category_id,
      });
      if (!courseCategory) {
        throw new BadRequestException(en.InvalidCourseCategory);
      }
    }

    await this.repository.update(
      { id },
      {
        ...updateCourseDto,
        course_category_id:
          +updateCourseDto.course_category_id || course.course_category_id,
      },
    );
  }

  async assignRoadmapCourse(
    id: number,
    assignRoadmapsToCourseDto: AssignRoadmapsToCourseDto,
  ): Promise<void> {
    const course = await this.get({ id });
    if (!course) {
      throw new BadRequestException(en.CourseNotFound);
    }

    const roadmaps = await this.roadmapService.getMany({
      id: In(assignRoadmapsToCourseDto.roadmaps),
    });

    const compareRoadmapLength =
      roadmaps.length !== assignRoadmapsToCourseDto.roadmaps.length;
    if (compareRoadmapLength) {
      throw new BadRequestException(en.invalidRoadmaps);
    }

    await this.repository.save({ ...course, roadmaps });
  }

  /**
   * Updates the archive status of a course
   */
  async updateCourseArchiveStatus(
    id: number,
    archived: boolean,
    currentUser: UserEntity,
  ): Promise<void> {
    // For status update, we don't need lessons
    const course = await this.repository.findOne({
      where: { id },
      relations: ['course_category'], // Only include necessary relations
    });

    if (!course) {
      throw new BadRequestException(en.CourseNotFound);
    }

    await this.update(
      { id },
      {
        archived,
        updated_by_id: currentUser.id,
      },
    );
  }

  /**
   * Archives a course
   */
  async archiveCourse(id: number, currentUser: UserEntity): Promise<void> {
    // For archiving, we don't need lessons
    const course = await this.repository.findOne({
      where: { id },
      relations: ['course_category'], // Only include necessary relations
    });

    if (!course) {
      throw new BadRequestException(en.CourseNotFound);
    }

    await this.update(
      { id },
      {
        archived: true,
        updated_by_id: currentUser.id,
      },
    );
  }

  /**
   * Gets archived courses with pagination
   */
  async getArchivedCourses(
    paginationDto: PaginationDto,
    relations: string[] = [],
  ): Promise<PaginatedResult<CourseEntity> | CourseEntity[]> {
    const { page = 1, limit = 10, q = '', mode = 'paginate' } = paginationDto;
    const order: FindOptionsOrder<CourseEntity> = {
      updated_at: 'DESC',
    };

    const allRelations = [...new Set([...courseRelations, ...relations])];

    const baseWhere: FindOptionsWhere<CourseEntity> = { archived: true };

    const whereConditions: FindOptionsWhere<CourseEntity>[] = [];

    if (q) {
      whereConditions.push(
        { ...baseWhere, name: ILike(`%${q}%`) },
        { ...baseWhere, description: ILike(`%${q}%`) },
        {
          ...baseWhere,
          course_category: {
            name: ILike(`%${q}%`),
          },
        },
      );
    }

    if (mode === 'paginate') {
      return await this.paginate(
        { page, limit },
        q ? whereConditions : baseWhere,
        allRelations,
        order,
      );
    }

    return await this.getMany(
      q ? whereConditions : baseWhere,
      order,
      allRelations,
    );
  }

  async deleteCourse(id: number): Promise<void> {
    const course = await this.getCourseDetails({ id }, []); // Get course without lessons to verify existence

    if (!course) {
      throw new BadRequestException(en.CourseNotFound);
    }

    const imageUsed = await this.getImagesUsedInLessonsRelatedCource({ id }, [
      'lessons',
    ]); // Get course without lessons to delete all images from s3

    if (imageUsed && imageUsed.length) {
      await this.FileService.deleteFiles(imageUsed);
    }
    // Using the repository's delete method for hard delete
    await this.repository.delete({ id });
  }

  async getUserCourseDetails(userId: number, id: number, roadmap?: number) {
    const course = this.repository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.course_category', 'course_category')
      .leftJoin('course.lessons', 'lessons')
      .addSelect([
        'lessons.id',
        'lessons.name',
        'lessons.content',
        'lessons.archived',
        'lessons.approved',
      ])
      .leftJoin('course.roadmaps', 'roadmaps')
      .innerJoin('roadmaps.users', 'users')
      .where('course.id = :id', { id })
      .andWhere('users.id = :userId', { userId })
      .andWhere('course.archived= :archived', { archived: false });

    if (roadmap) {
      course
        .addSelect('roadmaps')
        .andWhere('roadmaps.id = :roadmapId', { roadmapId: roadmap });
    }

    const courseDetails = await course.getOne();
    if (!courseDetails.lessons.length) {
      courseDetails.lessons = [];
    } else {
      courseDetails.lessons = await this.filterSanitisedLessons(
        courseDetails.lessons,
        { archived: false, approved: true },
      );
    }
    return courseDetails;
  }

  async getSearchedCourses(userId: number, isMember = false, query = '') {
    const queryBuilder = this.repository
      .createQueryBuilder('course')
      .andWhere('course.archived = :courseArchived', { courseArchived: false })
      .leftJoin(
        'course.roadmaps',
        'roadmaps',
        'roadmaps.archived = :roadmapArchived',
        { roadmapArchived: false },
      )
      .andWhere('course.name ILIKE :query', { query: `%${query}%` });

    if (isMember) {
      queryBuilder
        .innerJoin('roadmaps.users', 'users')
        .andWhere('users.id = :userId', { userId });
    }

    return queryBuilder.select(['course.id', 'course.name']).limit(3).getMany();
  }

  async getOrphanCourses(page = 1, limit = 10, q = '') {
    const queryBuilder = this.repository
      .createQueryBuilder('course')
      .where('course.archived = :courseArchived', { courseArchived: false })
      .leftJoin('course.roadmaps', 'roadmap')
      .andWhere('roadmap.id IS NULL')
      .leftJoinAndSelect('course.created_by', 'created_by')
      .leftJoinAndSelect('course.course_category', 'course_category');

    if (q) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('course.name ILIKE :q', { q: `%${q}%` })
            .orWhere('course_category.name ILIKE :q', { q: `%${q}%` })
            .orWhere(
              'created_by.first_name ILIKE :q OR created_by.last_name ILIKE :q',
              { q: `%${q}%` },
            );
        }),
      );
    }

    return this.queryBuilderPaginate(queryBuilder, page, limit);
  }
}
