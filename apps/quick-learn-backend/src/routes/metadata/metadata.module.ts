import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { RoadmapCategoriesModule } from '../roadmap-category/roadmap-category.module';
import { CourseCategoriesModule } from '../course-category/course-category.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [RoadmapCategoriesModule, CourseCategoriesModule, LessonModule],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
