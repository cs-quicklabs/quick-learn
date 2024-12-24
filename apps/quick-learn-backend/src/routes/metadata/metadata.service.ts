import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCategoryEntity, RoadmapCategoryEntity } from '@src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(RoadmapCategoryEntity)
    @InjectRepository(CourseCategoryEntity)
    private roadmapCategoryRepository: Repository<RoadmapCategoryEntity>,
    private courseCategoryRepository: Repository<CourseCategoryEntity>,
  ) {}

  async getContentRepositoryMetadata() {
    const metadata = {};
    metadata['roadmap_categories'] =
      await this.getRoadmapCatergoriesWithRoadmap();
    metadata['course_categories'] = await this.getCourseCategoriesWithCourses();
    return metadata;
  }

  async getRoadmapCatergoriesWithRoadmap() {
    return await this.roadmapCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.roadmaps', 'roadmaps')
      .where('roadmaps.archived = :archived', { archived: false })
      .orderBy('category.name', 'ASC')
      .addOrderBy('category.created_at', 'DESC')
      .getMany();
  }
  async getCourseCategoriesWithCourses() {
    return await this.courseCategoryRepository
      .createQueryBuilder('course_category')
      .leftJoinAndSelect(
        'course_category.courses',
        'courses',
        'courses.archived = :archived',
        { archived: false },
      )
      .leftJoin('courses.lessons', 'lessons')
      .loadRelationCountAndMap(
        'courses.lessons_count',
        'courses.lessons',
        'lessons',
        (qb) =>
          qb.andWhere('lessons.archived = :archived', { archived: false }),
      )
      .orderBy('courses.created_at', 'DESC')
      .addOrderBy('course_category.created_at', 'DESC')
      .getMany();
  }
}
