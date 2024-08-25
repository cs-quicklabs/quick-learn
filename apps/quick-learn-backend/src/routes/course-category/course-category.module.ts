import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCategoryEntity } from '@src/entities';
import { CourseCategoryController } from './course-category.controller';
import { CourseCategoryService } from './course-category.service';

@Module({
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
  imports: [TypeOrmModule.forFeature([CourseCategoryEntity])],
  exports: [CourseCategoryService],
})
export class CourseCategoriesModule {}
