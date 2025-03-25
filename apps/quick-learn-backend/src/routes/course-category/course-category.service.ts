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

  async createCourseCategory(
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

  async updateCourseCategory(
    id: number,
    updateCourseCategoryDto: UpdateCourseCategoryDto,
    team_id: number,
  ) {
    const courseCategory = await this.get({ id, team_id });

    if (courseCategory) {
      throw new BadRequestException(en.InvalidCourseCategory);
    }

    const foundCourseCategory = await this.get({
      name: ILike(updateCourseCategoryDto.name),
      team_id,
    });

    if (foundCourseCategory && foundCourseCategory.id !== courseCategory.id) {
      throw new BadRequestException('Course Category already exists');
    }

    return await this.update({ id }, updateCourseCategoryDto);
  }

  async deleteCourseCategory(id: number, user: number): Promise<void> {
    const courseCategory = await this.get({ id }, ['courses']);
    if (courseCategory.team_id !== user) {
      throw new BadRequestException(
        'You do not have permission to delete this course category',
      );
    }
    if (courseCategory.courses.length > 0) {
      throw new BadRequestException(en.courseCategriesHasData);
    }
    await this.repository.delete({ id });
  }

  async getCourseCategoriesWithCourses({ team_id }: UserEntity) {
    return await this.repository
      .createQueryBuilder('course_category')
      .where('course_category.team_id = :teamId', { teamId: team_id })
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
          qb.andWhere('lessons.archived = :archived', {
            archived: false,
          }),
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
