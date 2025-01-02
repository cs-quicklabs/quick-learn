import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { RoadmapCategoriesModule } from '../roadmap-category/roadmap-category.module';
import { CourseCategoriesModule } from '../course-category/course-category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCategoryEntity, RoadmapCategoryEntity } from '@src/entities';

@Module({
  imports: [RoadmapCategoriesModule, CourseCategoriesModule],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
