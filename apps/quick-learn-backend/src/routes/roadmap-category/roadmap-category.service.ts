import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoadmapCategoryDto } from './dto/create-roadmap-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoadmapCategoryEntity } from '@src/entities';
import { BasicCrudService } from '@src/common/services';
import { UpdateRoadmapCategoryDto } from './dto/update-roadmap-category.dto';

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
      where: { name: createRoadmapCategoryDto.name },
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
      name: updateRoadmapCategoryDto.name,
    });
    if (
      roadmapCategoryByName &&
      roadmapCategoryByName.id !== roadmapCategory.id
    ) {
      throw new BadRequestException('Roadmap Category already exists.');
    }
    await this.update({ id }, updateRoadmapCategoryDto);
  }
}
