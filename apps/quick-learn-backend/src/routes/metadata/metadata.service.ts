import { Injectable } from '@nestjs/common';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { CourseCategoryService } from '../course-category/course-category.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly roadmapCategoryService: RoadmapCategoryService,
    private readonly courseCategoryService: CourseCategoryService,
  ) { }

  async getContentRepositoryMetadata() {
    const metadata = {};
    const [roadmapCategories, courseCategories] = await Promise.all([
      this.roadmapCategoryService.getMany(
        {},
        { name: 'ASC', created_at: 'DESC' },
        ['roadmaps'],
      ),
      this.courseCategoryService.getAllCourseCategoriesWithLessonsCount(),
    ]);

    // TODO: Enhance this to use a query builder or typeorm function to filter out archived roadmaps and courses
    roadmapCategories.forEach((category) => {
      category.roadmaps = category.roadmaps.filter(
        (roadmap) => roadmap.archived === false,
      );
    });

    courseCategories.forEach((category) => {
      category.courses = category.courses.filter(
        (course) => course.archived === false,
      );
    });

    metadata['roadmap_categories'] = roadmapCategories;
    metadata['course_categories'] = courseCategories;
    return metadata;
  }

  async getContentRepositoryWithLessionCount() {
    const metadata = {};
    const courseData = await this.courseCategoryService.getAllCourseCategoriesWithLessonsCount()
    courseData.forEach((category) => {
      category.courses = category.courses.filter(
        (course) => course.archived === false,
      );
    });
    metadata['course_categories'] = courseData;
    return metadata;
  }
}
