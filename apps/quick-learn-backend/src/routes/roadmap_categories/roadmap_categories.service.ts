import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoadmapCategoryDto } from './dto/create-roadmap_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadmapCategoryEntity } from '@src/entities/roadmap_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoadmapCategoriesService {
  constructor(
    @InjectRepository(RoadmapCategoryEntity)
    private roadmapRepostory: Repository<RoadmapCategoryEntity>,
  ) {}

  async create(createRoadmapCategoryDto: CreateRoadmapCategoryDto) {
    const foundRoadmapCategory = await this.roadmapRepostory.count({
      where: { name: createRoadmapCategoryDto.name },
    });

    if (foundRoadmapCategory) {
      throw new BadRequestException('Roadmap Category already exists');
    }

    const roadmapCategory = await this.roadmapRepostory.create(
      createRoadmapCategoryDto,
    );
    return await this.roadmapRepostory.save(roadmapCategory);
  }

  async findAll() {
    return await this.roadmapRepostory.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} roadmapCategory`;
  }

  update(id: number) {
    return `This action updates a #${id} roadmapCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} roadmapCategory`;
  }
}
