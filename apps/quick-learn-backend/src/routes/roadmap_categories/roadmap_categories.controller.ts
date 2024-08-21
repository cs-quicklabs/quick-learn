import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoadmapCategoriesService } from './roadmap_categories.service';
import { CreateRoadmapCategoryDto } from './dto/create-roadmap_category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/roadmap-categories
@ApiTags('Roadmap Categories')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'roadmap-categories',
})
export class RoadmapCategoriesController {
  constructor(
    private readonly roadmapCategoriesService: RoadmapCategoriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'adding roadmap category' })
  async create(
    @Body() createRoadmapCategoryDto: CreateRoadmapCategoryDto,
  ): Promise<SuccessResponse> {
    await this.roadmapCategoriesService.create(createRoadmapCategoryDto);
    const roadmapCategories = await this.roadmapCategoriesService.findAll();
    return new SuccessResponse('Successfully added Roadmap Category', {
      categories: roadmapCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'get all roadmap categories' })
  async findAll() {
    const roadmapCategories = await this.roadmapCategoriesService.findAll();
    return new SuccessResponse('Roadmap Categories', {
      categories: roadmapCategories,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roadmapCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.roadmapCategoriesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roadmapCategoriesService.remove(+id);
  }
}
