import { Module } from '@nestjs/common';
import { RoadmapCategoriesService } from './roadmap_categories.service';
import { RoadmapCategoriesController } from './roadmap_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapCategoryEntity } from '@src/entities/roadmap_category.entity';

@Module({
  controllers: [RoadmapCategoriesController],
  providers: [RoadmapCategoriesService],
  imports: [TypeOrmModule.forFeature([RoadmapCategoryEntity])],
  exports: [RoadmapCategoriesService],
})
export class RoadmapCategoriesModule {}
