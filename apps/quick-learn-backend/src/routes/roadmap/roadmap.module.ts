import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { RoadmapEntity } from '@src/entities';
import { RoadmapCategoriesModule } from '../roadmap-category/roadmap-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoadmapEntity]), RoadmapCategoriesModule],
  providers: [RoadmapService],
  controllers: [RoadmapController],
  exports: [RoadmapService],
})
export class RoadmapModule {}
