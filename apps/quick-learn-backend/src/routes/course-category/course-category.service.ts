import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CourseCategoryEntity, UserEntity } from '@src/entities';
import { BasicCrudService } from '@src/common/services';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { en } from '@src/lang/en';

@Injectable()
export class CourseCategoryService extends BasicCrudService<CourseCategoryEntity> {
  constructor(
    @InjectRepository(CourseCategoryEntity)
    courseCategoryRepository: Repository<CourseCategoryEntity>,
  ) {
    super(courseCategoryRepository);
  }

  async createCourseCategories(
    createCourseCategoryDto: CreateCourseCategoryDto,
    user: UserEntity,
  ) {
    const foundCourseCategory = await this.repository.count({
      where: {
        name: ILike(createCourseCategoryDto.name),
        team_id: user.team_id,
      },
    });
    if (foundCourseCategory) {
      throw new BadRequestException('Course Category already exists');
    }
    const courseCategory = this.repository.create({
      ...createCourseCategoryDto,
      team_id: user.team_id,
    });
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

  async deleteCourseCategory(id: number): Promise<void> {
    const courseCategory = await this.get({ id }, ['courses']);
    if (courseCategory.courses.length > 0) {
      throw new BadRequestException(en.courseCategriesHasData);
    }
    await this.repository.delete({ id });
  }

  async getCourseCategoriesWithCourses() {
    return await this.repository
      .createQueryBuilder('course_category')
      .leftJoinAndSelect(
        'course_category.courses',
        'courses',
        'courses.archived = :archived',
        { archived: false },
      )
      .orderBy('course_category.name', 'ASC')
      .leftJoin('courses.lessons', 'lessons')
      .loadRelationCountAndMap(
        'courses.lessons_count',
        'courses.lessons',
        'lessons',
        (qb) =>
          qb.andWhere('lessons.archived = :archived', { archived: false }),
      )
      .leftJoin('courses.roadmaps', 'roadmaps')
      .loadRelationCountAndMap(
        'courses.roadmaps_count',
        'courses.roadmaps',
        'roadmaps',
      )
      .addOrderBy('course_category.created_at', 'DESC')
      .getMany();
  }
}
