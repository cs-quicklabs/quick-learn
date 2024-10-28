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

const courseRelations = ['roadmaps', 'course_category', 'created_by'];

@Injectable()
export class CourseService extends BasicCrudService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity) repo,
    @Inject(forwardRef(() => RoadmapService))
    private roadmapService: RoadmapService,
    private courseCategoryService: CourseCategoryService,
  ) {
    super(repo);
  }

  async getAllCourses(): Promise<CourseEntity[]> {
    return await this.getMany();
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
   */ async getCourseDetails(
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
      throw new BadRequestException(en.CourseNotFound);
    }

    // Only map lessons if they exist
    if (course.lessons) {
      course.lessons = course.lessons.map((lesson) => ({
        ...lesson,
        content: Helpers.limitSanitizedContent(lesson.content),
      })) as LessonEntity[];
    }

    return course;
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

    if (courseByname && courseByname.id !== course.id) {
      throw new BadRequestException(en.courseAlreadyExists);
    }

    if (updateCourseDto?.course_category_id) {
      const courseCategory = await this.courseCategoryService.get({
        id: +updateCourseDto.course_category_id,
      });
      if (!courseCategory) {
        throw new BadRequestException(en.InvalidCourseCategory);
      }
    }

    await this.save({
      ...course,
      ...updateCourseDto,
      course_category_id:
        +updateCourseDto.course_category_id || course.course_category_id,
    });
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

    if (roadmaps.length !== assignRoadmapsToCourseDto.roadmaps.length) {
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

    // Using the repository's delete method for hard delete
    await this.repository.delete({ id });
  }
}
