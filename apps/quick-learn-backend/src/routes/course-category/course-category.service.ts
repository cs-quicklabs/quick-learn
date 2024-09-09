import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CourseCategoryEntity } from '@src/entities';
import { BasicCrudService } from '@src/common/services';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';

@Injectable()
export class CourseCategoryService extends BasicCrudService<CourseCategoryEntity> {
  constructor(
    @InjectRepository(CourseCategoryEntity)
    courseCategoryRepository: Repository<CourseCategoryEntity>,
  ) {
    super(courseCategoryRepository);
  }

  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const foundCourseCategory = await this.repository.count({
      where: { name: ILike(createCourseCategoryDto.name) },
    });
    if (foundCourseCategory) {
      throw new BadRequestException('Course Category already exists');
    }
    const courseCategory = this.repository.create(createCourseCategoryDto);
    return await this.repository.save(courseCategory);
  }

  async createCourseCategory(
    id: number,
    createCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    const courseCategory = await this.get({ id });
    const foundCourseCategory = await this.get({
      name: ILike(createCourseCategoryDto.name),
    });
    if (foundCourseCategory && foundCourseCategory.id !== courseCategory.id) {
      throw new BadRequestException('Course Category already exists');
    }
    return await this.update({ id }, createCourseCategoryDto);
  }
}
