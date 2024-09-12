import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { RoadmapEntity, UserEntity } from '@src/entities';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { en } from '@src/lang/en';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { AssignCoursesToRoadmapDto } from './dto/assing-courses-to-roadmap';
import { CourseService } from '../course/course.service';

const roadmapRelations = ['roadmap_category', 'courses', 'created_by'];

@Injectable()
export class RoadmapService extends BasicCrudService<RoadmapEntity> {
  constructor(
    @InjectRepository(RoadmapEntity) repo,
    private roadmapCategoryService: RoadmapCategoryService,
    private courseService: CourseService,
  ) {
    super(repo);
  }

  async getAllRoadmaps(): Promise<RoadmapEntity[]> {
    return await this.repository
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
      .orderBy('roadmap.created_at', 'DESC')
      .getMany();
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

  async getRoadmapDetails(
    options: FindOptionsWhere<RoadmapEntity>,
    relations: string[] = [],
  ): Promise<RoadmapEntity> {
    const roadmaps = await this.get({ ...options }, [
      ...roadmapRelations,
      ...relations,
    ]);
    if (!roadmaps) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    roadmaps.courses = roadmaps.courses.filter((course) => !course.archived);

    return roadmaps;
  }

  async updateRoadmap(
    id: number,
    updateRoadmapDto: UpdateRoadmapDto,
  ): Promise<RoadmapEntity> {
    const roadmap = await this.get({ id });
    const roadmapByName = await this.get({
      name: ILike(updateRoadmapDto.name),
    });

    if (!roadmap) {
      throw new BadRequestException('Roadmap not found');
    }

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

    return await this.get({ id });
  }

  async archiveRoadmap(id: number) {
    const roadmap = await this.get({ id }, ['courses']);
    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }
    roadmap.courses.map((course) => {
      return { ...course, archived: true };
    });
    roadmap.archived = true;
    delete roadmap.updated_at;
    await this.repository.save(roadmap);
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

    await this.repository.save({ ...roadmap, courses });
  }
}
