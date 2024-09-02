import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapCategoryController } from './roadmap-category.controller';
import { RoadmapCategoryService } from './roadmap-category.service';
import { RoadmapCategoryEntity } from '@src/entities';

@Module({
  controllers: [RoadmapCategoryController],
  providers: [RoadmapCategoryService],
  imports: [TypeOrmModule.forFeature([RoadmapCategoryEntity])],
  exports: [RoadmapCategoryService],
})
export class RoadmapCategoriesModule {}
