import { Injectable } from '@nestjs/common';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { CourseCategoryService } from '../course-category/course-category.service';
import { LessonService } from '../lesson/lesson.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly roadmapCategoryService: RoadmapCategoryService,
    private readonly courseCategoryService: CourseCategoryService,
    private readonly lessonService: LessonService,
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

  async getLessonMetaData() {
    const [unapproved_lessons, flagged_lessons] = await Promise.all([
      await this.lessonService.getUnApprovedLessonCount(),
      await this.lessonService.getFlaggedLessonCount(),
    ]);
    return {
      unapproved_lessons,
      flagged_lessons,
    };
  }
}
