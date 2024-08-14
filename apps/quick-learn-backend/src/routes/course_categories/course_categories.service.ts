import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCategoryEntity } from '@src/entities/course_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseCategoriesService {
  constructor(
    @InjectRepository(CourseCategoryEntity)
    private courseCategoryRepository: Repository<CourseCategoryEntity>,
  ) {}

  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const foundCourseCategory = await this.courseCategoryRepository.count({
      where: { name: createCourseCategoryDto.name },
    });
    if (foundCourseCategory) {
      throw new BadRequestException('Course Category already exists');
    }
    const courseCategory = await this.courseCategoryRepository.create(
      createCourseCategoryDto,
    );
    return await this.courseCategoryRepository.save(courseCategory);
  }

  async findAll() {
    return await this.courseCategoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} courseCategory`;
  }

  update(id: number) {
    return `This action updates a #${id} courseCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseCategory`;
  }
}
