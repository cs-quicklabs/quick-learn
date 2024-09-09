import { Injectable } from '@nestjs/common';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { CourseCategoryService } from '../course-category/course-category.service';

@Injectable()
export class MetadataService {
  constructor(
    private roadmapCategoryService: RoadmapCategoryService,
    private courseCategoryService: CourseCategoryService,
  ) {}

  async getContentRepositoryMetadata() {
    const metadata = {};
    const [roadmapCategories, courseCategories] = await Promise.all([
      this.roadmapCategoryService.getMany(
        {},
        { name: 'ASC', created_at: 'DESC' },
      ),
      this.courseCategoryService.getMany(
        {},
        { name: 'ASC', created_at: 'DESC' },
      ),
    ]);
    metadata['roadmap_categories'] = roadmapCategories;
    metadata['course_categories'] = courseCategories;
    return metadata;
  }
}
