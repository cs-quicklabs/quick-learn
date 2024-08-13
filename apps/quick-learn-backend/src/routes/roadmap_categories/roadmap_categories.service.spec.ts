import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapCategoriesService } from './roadmap_categories.service';

describe('RoadmapCategoriesService', () => {
  let service: RoadmapCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoadmapCategoriesService],
    }).compile();

    service = module.get<RoadmapCategoriesService>(RoadmapCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
