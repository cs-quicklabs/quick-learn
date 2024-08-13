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
import { UpdateRoadmapCategoryDto } from './dto/update-roadmap_category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuccessResponse } from '@src/common/dto';

@ApiTags('Roadmap Categories')
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/roadmap-categories
@Controller({
  version: '1',
  path: 'roadmap-categories',
})
export class RoadmapCategoriesController {
  constructor(
    private readonly roadmapCategoriesService: RoadmapCategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'adding roadmap category' })
  async create(
    @Body() createRoadmapCategoryDto: CreateRoadmapCategoryDto,
  ): Promise<SuccessResponse> {
    const roadmapCategory = await this.roadmapCategoriesService.create(
      createRoadmapCategoryDto,
    );

    return new SuccessResponse(
      'Successfully added Roadmap Category',
      roadmapCategory,
    );
  }

  @UseGuards(JwtAuthGuard)
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
  update(
    @Param('id') id: string,
    @Body() updateRoadmapCategoryDto: UpdateRoadmapCategoryDto,
  ) {
    return this.roadmapCategoriesService.update(+id, updateRoadmapCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roadmapCategoriesService.remove(+id);
  }
}
