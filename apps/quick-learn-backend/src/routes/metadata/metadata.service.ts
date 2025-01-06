import { Injectable } from '@nestjs/common';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { CourseCategoryService } from '../course-category/course-category.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly roadmapCategoryService: RoadmapCategoryService,
    private readonly courseCategoryService: CourseCategoryService,
  ) {}

  async getContentRepositoryMetadata() {
    const metadata = {};
    const [roadmapCategories, courseCategories] = await Promise.all([
      this.roadmapCategoryService.getRoadmapCatergoriesWithRoadmap(),
      this.courseCategoryService.getCourseCategoriesWithCourses(),
    ]);

    metadata['roadmap_categories'] = roadmapCategories;
    metadata['course_categories'] = courseCategories;

    return metadata;
  }
}
