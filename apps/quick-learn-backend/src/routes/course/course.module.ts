import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseEntity } from '@src/entities';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { CourseCategoriesModule } from '../course-category/course-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity]),
    forwardRef(() => RoadmapModule),
    CourseCategoriesModule,
  ],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
