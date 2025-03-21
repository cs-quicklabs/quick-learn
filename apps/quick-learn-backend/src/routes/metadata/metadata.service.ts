import { Injectable } from '@nestjs/common';
import { RoadmapCategoryService } from '../roadmap-category/roadmap-category.service';
import { CourseCategoryService } from '../course-category/course-category.service';
import { LessonService } from '../lesson/lesson.service';
import { UserEntity } from '@src/entities';

@Injectable()
export class MetadataService {
  constructor(
    private readonly roadmapCategoryService: RoadmapCategoryService,
    private readonly courseCategoryService: CourseCategoryService,
    private readonly lessonService: LessonService,
  ) {}

  async getContentRepositoryMetadata(user: UserEntity) {
    const metadata = {};
    const [roadmapCategories, courseCategories] = await Promise.all([
      this.roadmapCategoryService.getRoadmapCatergoriesWithRoadmap(user),
      this.courseCategoryService.getCourseCategoriesWithCourses(user),
    ]);

    metadata['roadmap_categories'] = roadmapCategories;
    metadata['course_categories'] = courseCategories;

    return metadata;
  }

  async getLessonMetaData(user: UserEntity) {
    const [unapproved_lessons, flagged_lessons] = await Promise.all([
      await this.lessonService.getUnApprovedLessonCount(user),
      await this.lessonService.getFlaggedLessonCount(user),
    ]);
    return {
      unapproved_lessons,
      flagged_lessons,
    };
  }
}
