import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, ILike, In } from 'typeorm';
import { BasicCrudService } from '@src/common/services';
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
export class CourseService extends BasicCrudService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity) repo,
    @Inject(forwardRef(() => RoadmapService))
    private roadmapService: RoadmapService,
    private courseCategoryService: CourseCategoryService,
    private readonly FileService: FileService,
  ) {
    super(repo);
  }

  async getContentRepoCourses(
    paginationDto: PaginationDto,
    options: FindOptionsWhere<CourseEntity>, // filter conditions
    relations: string[] = [], // additional relations to include
  ): Promise<{
    courses: CourseEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder('courses');
    const { page = 1, limit = 10 } = paginationDto;
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

    // Calculate total count before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Get paginated courses
    const courses = await queryBuilder.getMany();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      courses,
      total,
      page,
      totalPages,
    };
  }

  async getAllCourses(
    options: FindOptionsWhere<CourseEntity>, // filter conditions
    relations: string[] = [], // additional relations to include
  ): Promise<CourseEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('courses');

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
      .leftJoinAndSelect('courses.course_category', 'course_category')
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
      .orderBy('courses.created_at', 'DESC')
      .addOrderBy('course_category.created_at', 'DESC');

    return await queryBuilder.getMany();
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

    const course = await this.get({ name: ILike(createCourseDto.name) });

    if (course) {
      throw new BadRequestException(en.courseAlreadyExists);
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

    const courseCount = await this.getCourseParticipantCount(course.id);
    course['userCount'] = courseCount;

    if (!course.lessons) {
      course.lessons = [];
    } else {
      // Filter lessons if they exist
      course.lessons = course.lessons
        .filter((lesson) => !lesson.archived)
        .map((lesson) => ({
          ...lesson,
          content: Helpers.limitSanitizedContent(lesson.content),
        })) as LessonEntity[];
    }

    return course;
  }

  async getCourseParticipantCount(id: number) {
    const queryBuilder = this.repository
      .createQueryBuilder('course')
      .leftJoin('course.roadmaps', 'roadmap')
      .leftJoin('roadmap.users', 'user')
      .where('course.id = :courseId', { courseId: id })
      .select('COUNT(DISTINCT user.id)', 'userCount');

    const result = await queryBuilder.getRawOne();
    return result?.userCount || 0;
  }

  /**
   * Gets course details from assigned roadmaps
   */

  async getUserAssignedRoadmapCourses(userId: number): Promise<CourseEntity[]> {
    // INNER JOINT CREATED ON user_roadmaps TO GET ALL ASSIGNED ROADMAPS USER ID CHECK ADDED FOR SAME, LEFT JOINT CREATED ON lessons TO GET ALL LESSONS COUNT
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

    let imageToDelete = [];
    if (!course.lessons) {
      return (imageToDelete = []);
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
  ): Promise<PaginatedResult<CourseEntity>> {
    const { page = 1, limit = 10, q = '' } = paginationDto;
    const skip = (page - 1) * limit;

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

    const [items, total] = await this.repository.findAndCount({
      where: q ? whereConditions : baseWhere,
      relations: allRelations,
      skip,
      take: limit,
      order: {
        updated_at: 'DESC',
      },
    });

    return {
      items,
      total,
      page,
      total_pages: Math.ceil(total / limit),
      limit,
    };
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
    if (courseDetails && courseDetails.lessons.length > 0) {
      courseDetails.lessons = courseDetails.lessons
        .filter((lesson) => !lesson.archived && lesson.approved)
        .map((lesson) => ({
          ...lesson,
          content: Helpers.limitSanitizedContent(lesson.content),
        })) as LessonEntity[];
    } else if (courseDetails) {
      courseDetails.lessons = [];
    }
    return courseDetails;
  }
}
