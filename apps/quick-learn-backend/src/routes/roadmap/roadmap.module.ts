import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { RoadmapEntity, UserEntity } from '@src/entities';
import { RoadmapCategoriesModule } from '../roadmap-category/roadmap-category.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoadmapEntity, UserEntity]),
    RoadmapCategoriesModule,
    CourseModule,
  ],
  providers: [RoadmapService],
  controllers: [RoadmapController],
  exports: [RoadmapService],
})
export class RoadmapModule {}
