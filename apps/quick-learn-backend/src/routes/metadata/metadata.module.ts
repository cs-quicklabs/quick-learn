import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { RoadmapCategoriesModule } from '../roadmap-category/roadmap-category.module';
import { CourseCategoriesModule } from '../course-category/course-category.module';

@Module({
  imports: [RoadmapCategoriesModule, CourseCategoriesModule],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
