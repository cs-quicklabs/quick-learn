import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, In, Not, Repository } from 'typeorm';
import { PaginationService } from '@src/common/services/pagination.service';
import { RoadmapEntity, UserEntity } from '@src/entities';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { en } from '@src/lang/en';
import { AssignCoursesToRoadmapDto } from './dto/assing-courses-to-roadmap';
import { CourseService } from '../course/course.service';
import { PaginationDto } from '../users/dto';
import { PaginatedResult } from '@src/common/interfaces';

@Injectable()
export class RoadmapService extends PaginationService<RoadmapEntity> {
  constructor(
    @InjectRepository(RoadmapEntity)
    roadmapRepository: Repository<RoadmapEntity>,
    private readonly roadmapCategoryService: RoadmapCategoryService,
    private readonly courseService: CourseService,
  ) {
    super(roadmapRepository);
  }

  async getAllRoadmaps(): Promise<RoadmapEntity[]> {
    return this.repository
      .createQueryBuilder('roadmap')
      .andWhere('roadmap.archived = :archived', { archived: false })
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect(
        'roadmap.courses',
        'courses',
        'courses.archived = :archived',
        { archived: false },
      )
      .loadRelationCountAndMap(
        'roadmap.courses_count',
        'roadmap.courses',
        'courses',
        (qb) =>
          qb.andWhere('courses.archived = :archived', { archived: false }),
      )
      .loadRelationCountAndMap(
        'courses.lessons_count',
        'courses.lessons',
        'lessons',
        (qb) =>
          qb.andWhere('lessons.archived = :archived', { archived: false }),
      )
      .orderBy('roadmap.created_at', 'DESC')
      .getMany();
  }

  async findSearchedRoadmap(userId: number, isMember = false, query = '') {
    const queryBuilder = this.repository
      .createQueryBuilder('roadmap')
      .andWhere('roadmap.archived = :roadmapArchived', {
        roadmapArchived: false,
      });

    if (isMember) {
      queryBuilder
        .leftJoin(
          'roadmap.courses',
          'courses',
          'courses.archived = :courseArchived',
          {
            courseArchived: false,
          },
        )
        .leftJoin(
          'courses.lessons',
          'lessons',
          'lessons.archived = :lessonArchived',
          {
            lessonArchived: false,
          },
        )
        .innerJoin('roadmap.users', 'users')
        .andWhere('users.id = :userId', { userId });
    }

    return queryBuilder
      .andWhere('roadmap.name ILIKE :query', { query: `%${query}%` })
      .groupBy('roadmap.id')
      .select(['roadmap.id', 'roadmap.name'])
      .limit(3)
      .getMany();
  }

  async findAllArchived(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RoadmapEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect('roadmap.created_by', 'created_by')
      .leftJoinAndSelect('roadmap.updated_by', 'updated_by')
      .loadRelationCountAndMap(
        'roadmap.courses_count',
        'roadmap.courses',
        'courses',
        (qb) =>
          qb.where('courses.archived = :courseArchived', {
            courseArchived: false,
          }),
      )
      .where('roadmap.archived = :archived', { archived: true });

    // Add search functionality
    if (paginationDto.q) {
      queryBuilder.andWhere(
        '(roadmap.name ILIKE :search OR roadmap.description ILIKE :search OR roadmap_category.name ILIKE :search)',
        { search: `%${paginationDto.q}%` },
      );
    }

    return await this.queryBuilderPaginate(
      queryBuilder,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  async createRoadmap(
    createRoadmapDto: CreateRoadmapDto,
    user: UserEntity,
  ): Promise<RoadmapEntity> {
    // Check for existing roadmap with same name
    const existingRoadmap = await this.get({
      name: ILike(`%${createRoadmapDto.name}%`),
    });

    if (existingRoadmap) {
      throw new BadRequestException(en.RoadmapAlreadyExists);
    }

    // Verify roadmap category exists
    const roadmapCategory = await this.roadmapCategoryService.get({
      id: +createRoadmapDto.roadmap_category_id,
    });

    if (!roadmapCategory) {
      throw new BadRequestException(en.InvalidRoadmapCategory);
    }

    return await this.create({
      ...createRoadmapDto,
      roadmap_category_id: +createRoadmapDto.roadmap_category_id,
      created_by_user_id: user.id,
    });
  }

  async updateRoadmap(
    id: number,
    updateRoadmapDto: UpdateRoadmapDto,
    userID: number,
  ): Promise<RoadmapEntity> {
    const roadmap = await this.getRoadmapById(id, ['roadmap_category']);

    const handleActiveStatus =
      Object.keys(updateRoadmapDto).length === 1 &&
      'active' in updateRoadmapDto;
    if (handleActiveStatus) {
      await this.repository.update(
        { id },
        {
          archived: !updateRoadmapDto.active,
          updated_by_id: userID,
        },
      );
      return await this.getRoadmapById(id);
    }

    // Check for name conflicts if name is being updated
    if (updateRoadmapDto.name) {
      const existingRoadmap = await this.get({
        name: ILike(`%${updateRoadmapDto.name}%`),
        id: Not(id),
      });

      if (existingRoadmap) {
        throw new BadRequestException(en.RoadmapAlreadyExists);
      }
    }

    const verifyRoadmapCategory = updateRoadmapDto.roadmap_category_id;
    if (verifyRoadmapCategory) {
      const roadmapCategory = await this.roadmapCategoryService.get({
        id: +updateRoadmapDto.roadmap_category_id,
      });
      if (!roadmapCategory) {
        throw new BadRequestException(en.InvalidRoadmapCategory);
      }
    }

    await this.repository.update(
      { id },
      {
        ...updateRoadmapDto,
        roadmap_category_id: updateRoadmapDto.roadmap_category_id
          ? +updateRoadmapDto.roadmap_category_id
          : roadmap.roadmap_category_id,
      },
    );

    return await this.getRoadmapById(id);
  }

  private async getRoadmapById(
    id: number,
    relations = ['roadmap_category', 'courses', 'created_by', 'updated_by'],
  ): Promise<RoadmapEntity> {
    const roadmap = await this.get({ id }, relations);
    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    return roadmap;
  }

  async archiveRoadmap(id: number): Promise<void> {
    await this.getRoadmapById(id);
    await this.update({ id }, { archived: true });
  }

  async getRoadmapDetailsWithCourseAndLessonsCount(
    roadmapId: number,
    courseId?: number,
    isArchived = false,
  ): Promise<RoadmapEntity> {
    const queryBuilder = this.repository
      .createQueryBuilder('roadmap')
      .where('roadmap.id = :id', { id: roadmapId })
      .andWhere('roadmap.archived = :archivedRoadmap', {
        archivedRoadmap: isArchived,
      })
      .leftJoin('roadmap.users', 'users')
      .loadRelationCountAndMap(
        'roadmap.userCount',
        'roadmap.users',
        'user',
        (qb) => qb.andWhere('user.active= :ActiveUser', { ActiveUser: true }),
      ) // Count users assigned to each roadmap
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect(
        'roadmap.courses',
        'courses',
        'courses.archived = :archivedCourse',
        { archivedCourse: false },
      )
      .leftJoinAndSelect('roadmap.created_by', 'created_by')
      .leftJoinAndSelect('roadmap.updated_by', 'updated_by');

    if (courseId) {
      queryBuilder.andWhere('courses.id = :courseId', { courseId });
    }

    queryBuilder
      .leftJoin('courses.lessons', 'lessons')
      .loadRelationCountAndMap(
        'courses.lessons_count',
        'courses.lessons',
        'lessons',
        (qb) =>
          qb.andWhere('lessons.archived = :archived', { archived: false }),
      )
      .orderBy('courses.created_at', 'DESC');

    const roadmap = await queryBuilder.getOne();

    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    return roadmap;
  }

  async assignRoadmap(
    id: number,
    assignCourses: AssignCoursesToRoadmapDto,
  ): Promise<void> {
    const roadmap = await this.getRoadmapById(id);

    const courses = await this.courseService.getMany({
      id: In(assignCourses.courses),
    });

    if (courses.length !== assignCourses.courses.length) {
      throw new BadRequestException(en.invalidCourses);
    }

    roadmap.courses = courses;
    await this.repository.save(roadmap);
  }

  async deleteRoadmap(id: number): Promise<DeleteResult> {
    // Get the queryRunner instance
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roadmap = await this.getRoadmapById(id);

      // Remove roadmap-course associations
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('roadmap_course')
        .where('roadmap_id = :id', { id: roadmap.id })
        .execute();

      // Remove user-roadmap associations
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('user_roadmap')
        .where('roadmap_id = :id', { id: roadmap.id })
        .execute();

      // Delete the roadmap
      const result = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(RoadmapEntity)
        .where({ id })
        .execute();

      // Commit transaction
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release queryRunner
      await queryRunner.release();
    }
  }

  async getUserRoadmapDetails(userId: number, roadmapId: number) {
    const queryBuilder = this.repository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect(
        'roadmap.courses',
        'course',
        'course.archived = :courseArchived',
        { courseArchived: false },
      )
      .leftJoinAndSelect(
        'course.lessons',
        'lesson',
        'lesson.archived = :lessonArchived',
        { lessonArchived: false },
      )
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoin('roadmap.users', 'user')
      .where('roadmap.id = :roadmapId', { roadmapId })
      .andWhere('user.id = :userId', { userId })
      .andWhere('roadmap.archived = :archived', { archived: false })
      .orderBy('course.id', 'ASC')
      .addOrderBy('lesson.id', 'ASC');

    return await queryBuilder.getOne();
  }
}
