import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoadmapCategoryDto } from './dto/create-roadmap-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RoadmapCategoryEntity } from '@src/entities';
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

  async create(createRoadmapCategoryDto: CreateRoadmapCategoryDto) {
    const foundRoadmapCategory = await this.repository.count({
      where: { name: ILike(createRoadmapCategoryDto.name) },
    });

    if (foundRoadmapCategory) {
      throw new BadRequestException('Roadmap Category already exists');
    }

    const roadmapCategory = this.repository.create(createRoadmapCategoryDto);
    return await this.repository.save(roadmapCategory);
  }

  async updateRoadmapCategory(
    id: number,
    updateRoadmapCategoryDto: UpdateRoadmapCategoryDto,
  ) {
    const roadmapCategory = await this.get({ id });
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

  async deleteRoadmapCategory(id: number): Promise<void> {
    const roadmapCategory = await this.get({ id }, ['roadmaps']);
    if (roadmapCategory.roadmaps.length > 0) {
      throw new BadRequestException(en.roadmapCategriesHasData);
    }

    await this.repository.delete({ id });
  }
  async getRoadmapCatergoriesWithRoadmap() {
    return await this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.roadmaps', 'roadmaps')
      .where('roadmaps.archived = :archived', { archived: false })
      .orderBy('category.name', 'ASC')
      .addOrderBy('category.created_at', 'DESC')
      .getMany();
  }
}
