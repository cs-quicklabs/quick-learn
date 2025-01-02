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
    metadata['roadmap_categories'] =
      await this.roadmapCategoryService.getRoadmapCatergoriesWithRoadmap();
    metadata['course_categories'] =
      await this.courseCategoryService.getCourseCategoriesWithCourses();
    return metadata;
  }
}
