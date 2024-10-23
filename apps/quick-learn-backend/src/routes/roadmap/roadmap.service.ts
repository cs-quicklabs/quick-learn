import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
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

const roadmapRelations = [
  'roadmap_category',
  'courses',
  'created_by',
  'updated_by',
];

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
    let conditions:
      | FindOptionsWhere<RoadmapEntity>
      | FindOptionsWhere<RoadmapEntity>[] = {
      archived: true,
    };

    // Add search functionality
    if (paginationDto.q) {
      const searchConditions: FindOptionsWhere<RoadmapEntity>[] = [
        {
          name: ILike(`%${paginationDto.q}%`),
          archived: true,
        },
        {
          description: ILike(`%${paginationDto.q}%`),
          archived: true,
        },
        {
          archived: true,
          roadmap_category: {
            name: ILike(`%${paginationDto.q}%`),
          },
        },
      ];
      conditions = searchConditions;
    }

    const results = await this.paginate(
      paginationDto,
      conditions,
      roadmapRelations,
    );

    // Add course counts for each roadmap
    for (const roadmap of results.items) {
      roadmap['courses_count'] =
        roadmap.courses?.filter((course) => !course.archived).length || 0;
    }

    return results;
  }

  async createRoadmap(
    createRoadmapDto: CreateRoadmapDto,
    user: UserEntity,
  ): Promise<RoadmapEntity> {
    const roadmap = await this.get({ name: ILike(createRoadmapDto.name) });

    if (roadmap) {
      throw new BadRequestException(en.RoadmapAlreadyExists);
    }

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
  ): Promise<RoadmapEntity> {
    const roadmap = await this.get({ id });

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
      return await this.get({ id });
    }

    // Regular update
    const roadmapByName = updateRoadmapDto.name
      ? await this.get({
          name: ILike(updateRoadmapDto.name),
        })
      : null;

    if (roadmapByName && roadmapByName.id !== roadmap.id) {
      throw new BadRequestException(en.RoadmapAlreadyExists);
    }

    if (updateRoadmapDto.roadmap_category_id) {
      const roadmapCategory = await this.roadmapCategoryService.get({
        id: +updateRoadmapDto.roadmap_category_id,
      });
      if (!roadmapCategory) {
        throw new BadRequestException(en.InvalidRoadmapCategory);
      }
    }

    await this.update(
      { id },
      {
        ...roadmap,
        ...updateRoadmapDto,
        roadmap_category_id:
          +updateRoadmapDto.roadmap_category_id || roadmap.roadmap_category_id,
      },
    );

    return await this.get({ id }, roadmapRelations);
  }

  async archiveRoadmap(id: number) {
    const roadmap = await this.get({ id });
    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }
    await this.roadmapRepository.update({ id }, { archived: true });
  }

  async getRoadmapDetailsWithCourseAndLessonsCount(
    roadmapId: number,
    courseId?: number,
  ): Promise<RoadmapEntity> {
    let roadmap = this.roadmapRepository
      .createQueryBuilder('roadmap')
      .where('roadmap.id = :id', { id: roadmapId })
      .andWhere('roadmap.archived = :archived', { archived: false })
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .leftJoinAndSelect(
        'roadmap.courses',
        'courses',
        'courses.archived = :archived',
        {
          archived: false,
        },
      );

    if (courseId) {
      roadmap = roadmap.andWhere('courses.id = :courseId', { courseId });
    }

    roadmap = roadmap
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

    const details = await roadmap.getOne();

    if (!details) {
      throw new BadRequestException(en.RoadmapNotFound);
    }
    return details;
  }

  async assignRoadmap(id: number, assingCourses: AssignCoursesToRoadmapDto) {
    const roadmap = await this.get({ id });
    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    const courses = await this.courseService.getMany({
      id: In(assingCourses.courses),
    });

    if (courses.length !== assingCourses.courses.length) {
      throw new BadRequestException(en.invalidCourses);
    }

    await this.roadmapRepository.save({ ...roadmap, courses });
  }
}
