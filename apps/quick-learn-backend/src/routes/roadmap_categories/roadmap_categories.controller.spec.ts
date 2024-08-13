import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapCategoriesController } from './roadmap_categories.controller';
import { RoadmapCategoriesService } from './roadmap_categories.service';

describe('RoadmapCategoriesController', () => {
  let controller: RoadmapCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoadmapCategoriesController],
      providers: [RoadmapCategoriesService],
    }).compile();

    controller = module.get<RoadmapCategoriesController>(
      RoadmapCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
