import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapCategoryController } from './roadmap-category.controller';
import { RoadmapCategoryService } from './roadmap-category.service';
import { RoadmapCategoryEntity, UserEntity } from '@src/entities';

@Module({
  controllers: [RoadmapCategoryController],
  providers: [RoadmapCategoryService],
  imports: [TypeOrmModule.forFeature([RoadmapCategoryEntity, UserEntity])],
  exports: [RoadmapCategoryService],
})
export class RoadmapCategoriesModule {}
