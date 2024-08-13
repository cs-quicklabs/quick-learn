import { Module } from '@nestjs/common';
import { CourseCategoriesService } from './course_categories.service';
import { CourseCategoriesController } from './course_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCategoryEntity } from '@src/entities/course_category.entity';

@Module({
  controllers: [CourseCategoriesController],
  providers: [CourseCategoriesService],
  imports: [TypeOrmModule.forFeature([CourseCategoryEntity])],
  exports: [CourseCategoriesService],
})
export class CourseCategoriesModule {}
