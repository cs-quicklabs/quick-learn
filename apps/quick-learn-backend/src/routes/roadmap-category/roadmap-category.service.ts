import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoadmapCategoryDto } from './dto/create-roadmap-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RoadmapCategoryEntity, UserEntity } from '@src/entities';
import { BasicCrudService } from '@src/common/services';
import { UpdateRoadmapCategoryDto } from './dto/update-roadmap-category.dto';
import { en } from '@src/lang/en';

@Injectable()
export class RoadmapCategoryService extends BasicCrudService<RoadmapCategoryEntity> {
  constructor(
    @InjectRepository(RoadmapCategoryEntity)
    repo: Repository<RoadmapCategoryEntity>,
  ) {
    super(repo);
  }

  async createRoadmapCategory(
    createRoadmapCategoryDto: CreateRoadmapCategoryDto,
    user: UserEntity,
  ) {
    const foundRoadmapCategory = await this.repository.count({
      where: {
        name: ILike(createRoadmapCategoryDto.name),
        team_id: user.team_id,
      },
    });

    if (foundRoadmapCategory) {
      throw new BadRequestException('Roadmap Category already exists');
    }

    const roadmapCategory = this.repository.create({
      ...createRoadmapCategoryDto,
      team_id: user.team_id,
    });
    return await this.repository.save(roadmapCategory);
  }

  async updateRoadmapCategory(
    id: number,
    updateRoadmapCategoryDto: UpdateRoadmapCategoryDto,
    user: number,
  ) {
    const roadmapCategory = await this.get({ id, team_id: user });
    const roadmapCategoryByName = await this.get({
      name: ILike(updateRoadmapCategoryDto.name),
    });
    if (
      roadmapCategoryByName &&
      roadmapCategoryByName.id !== roadmapCategory.id
    ) {
      throw new BadRequestException('Roadmap Category already exists.');
    }
    await this.update({ id }, updateRoadmapCategoryDto);
  }

  async deleteRoadmapCategory(id: number, user: number): Promise<void> {
    const roadmapCategory = await this.get({ id, team_id: user }, ['roadmaps']);
    if (roadmapCategory.roadmaps.length > 0) {
      throw new BadRequestException(en.roadmapCategriesHasData);
    }

    await this.repository.delete({ id });
  }
  async getRoadmapCategoryWithRoadmapAndCourses(is_courses, is_roadmap, user) {
    const queryBuilder = this.repository.createQueryBuilder('category');
    queryBuilder.where('category.team_id = :team_id', {
      team_id: user.team_id,
    });

    if (is_roadmap) {
      queryBuilder
        .leftJoinAndSelect('category.roadmaps', 'roadmaps')
        .andWhere('roadmaps.team_id = :team_id', { team_id: user.team_id })
        .andWhere('roadmaps.archived = :archived', { archived: false });
    }
    if (is_courses) {
      queryBuilder.leftJoinAndSelect(
        'roadmaps.courses',
        'courses',
        'courses.archived = :archived',
        { archived: false },
      );
    }

    return await queryBuilder
      .orderBy('category.name', 'ASC')
      .addOrderBy('category.created_at', 'DESC')
      .getMany();
  }

  async getRoadmapCatergoriesWithRoadmap(user: UserEntity) {
    return await this.repository
      .createQueryBuilder('category')
      .where('category.team_id = :teamId', { teamId: user.team_id })
      .leftJoinAndSelect(
        'category.roadmaps',
        'roadmaps',
        'roadmaps.archived = :archived',
        { archived: false, teamId: user.team_id },
      )
      .orderBy('category.name', 'ASC')
      .addOrderBy('category.created_at', 'DESC')
      .getMany();
  }
}
