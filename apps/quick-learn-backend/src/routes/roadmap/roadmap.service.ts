import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    private roadmapRepository: Repository<RoadmapEntity>,
    private readonly roadmapCategoryService: RoadmapCategoryService,
    private readonly courseService: CourseService,
  ) {
    super(roadmapRepository);
  }

  async getAllRoadmaps(): Promise<RoadmapEntity[]> {
    return await this.roadmapRepository
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
      .leftJoin('courses.lessons', 'lessons')
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

  async findAllArchived(
    user: UserEntity,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RoadmapEntity>> {
    const queryBuilder = this.roadmapRepository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect('roadmap.created_by', 'created_by')
      .leftJoinAndSelect('roadmap.updated_by', 'updated_by')
      .leftJoinAndSelect('roadmap.courses', 'courses')
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

    // Add pagination
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    queryBuilder
      .skip(skip)
      .take(paginationDto.limit)
      .orderBy('roadmap.created_at', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page: paginationDto.page,
      limit: paginationDto.limit,
      total_pages: Math.ceil(total / paginationDto.limit),
    };
  }
  async createRoadmap(
    createRoadmapDto: CreateRoadmapDto,
    user: UserEntity,
  ): Promise<RoadmapEntity> {
    // Check for existing roadmap with same name
    const existingRoadmap = await this.roadmapRepository
      .createQueryBuilder('roadmap')
      .where('LOWER(roadmap.name) = LOWER(:name)', {
        name: createRoadmapDto.name,
      })
      .getOne();

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

    const newRoadmap = this.roadmapRepository.create({
      ...createRoadmapDto,
      roadmap_category_id: +createRoadmapDto.roadmap_category_id,
      created_by_user_id: user.id,
    });

    return await this.roadmapRepository.save(newRoadmap);
  }

  async updateRoadmap(
    id: number,
    updateRoadmapDto: UpdateRoadmapDto,
  ): Promise<RoadmapEntity> {
    const roadmap = await this.roadmapRepository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .where('roadmap.id = :id', { id })
      .getOne();

    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    // Handle active status update
    if (
      Object.keys(updateRoadmapDto).length === 1 &&
      'active' in updateRoadmapDto
    ) {
      await this.roadmapRepository.update(
        { id },
        {
          archived: !updateRoadmapDto.active,
          updated_by_id: updateRoadmapDto['updated_by']?.id,
        },
      );
      return await this.getRoadmapById(id);
    }

    // Check for name conflicts if name is being updated
    if (updateRoadmapDto.name) {
      const existingRoadmap = await this.roadmapRepository
        .createQueryBuilder('roadmap')
        .where('LOWER(roadmap.name) = LOWER(:name)', {
          name: updateRoadmapDto.name,
        })
        .andWhere('roadmap.id != :id', { id })
        .getOne();

      if (existingRoadmap) {
        throw new BadRequestException(en.RoadmapAlreadyExists);
      }
    }

    // Verify roadmap category if it's being updated
    if (updateRoadmapDto.roadmap_category_id) {
      const roadmapCategory = await this.roadmapCategoryService.get({
        id: +updateRoadmapDto.roadmap_category_id,
      });
      if (!roadmapCategory) {
        throw new BadRequestException(en.InvalidRoadmapCategory);
      }
    }

    await this.roadmapRepository.update(
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

  private async getRoadmapById(id: number): Promise<RoadmapEntity> {
    return await this.roadmapRepository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect('roadmap.courses', 'courses')
      .leftJoinAndSelect('roadmap.created_by', 'created_by')
      .leftJoinAndSelect('roadmap.updated_by', 'updated_by')
      .where('roadmap.id = :id', { id })
      .getOne();
  }

  async archiveRoadmap(id: number): Promise<void> {
    const roadmap = await this.getRoadmapById(id);
    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }
    await this.roadmapRepository.update({ id }, { archived: true });
  }

  async getRoadmapDetailsWithCourseAndLessonsCount(
    roadmapId: number,
    courseId?: number,
  ): Promise<RoadmapEntity> {
    const queryBuilder = this.roadmapRepository
      .createQueryBuilder('roadmap')
      .where('roadmap.id = :id', { id: roadmapId })
      .andWhere('roadmap.archived = :archived', { archived: false })
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect(
        'roadmap.courses',
        'courses',
        'courses.archived = :archived',
        { archived: false },
      );

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
      .orderBy('courses.created_at', 'DESC')
      .addOrderBy('roadmap.created_at', 'DESC');

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
    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    const courses = await this.courseService.getMany({
      id: In(assignCourses.courses),
    });

    if (courses.length !== assignCourses.courses.length) {
      throw new BadRequestException(en.invalidCourses);
    }

    roadmap.courses = courses;
    await this.roadmapRepository.save(roadmap);
  }
}
