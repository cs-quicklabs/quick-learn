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
import { CreateRoadmapCategoryDto } from './dto/create-roadmap-category.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { RoadmapCategoryService } from './roadmap-category.service';
import { UpdateRoadmapCategoryDto } from './dto/update-roadmap-category.dto';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/roadmap-categories
@ApiTags('Roadmap Category')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'roadmap-categories',
})
export class RoadmapCategoryController {
  constructor(
    private readonly roadmapCategoryService: RoadmapCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adding roadmap category' })
  async create(
    @Body() createRoadmapCategoryDto: CreateRoadmapCategoryDto,
  ): Promise<SuccessResponse> {
    await this.roadmapCategoryService.create(createRoadmapCategoryDto);
    const roadmapCategories = await this.roadmapCategoryService.getMany(
      {},
      { name: 'ASC' },
    );
    return new SuccessResponse('Successfully created roadmap category.', {
      categories: roadmapCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all roadmap categories' })
  async findAll() {
    const roadmapCategories = await this.roadmapCategoryService.getMany(
      {},
      { name: 'ASC' },
    );
    return new SuccessResponse('Sucessfully retreived roadmap categories.', {
      categories: roadmapCategories,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the roadmap category details.' })
  findOne(@Param('id') id: string) {
    return this.roadmapCategoryService.get({ id: +id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the roadmap category.' })
  @ApiParam({ name: 'id', type: 'string' })
  async update(
    @Param('id') id: string,
    @Body() updateRoadmapCategoryDto: UpdateRoadmapCategoryDto,
  ) {
    await this.roadmapCategoryService.updateRoadmapCategory(
      +id,
      updateRoadmapCategoryDto,
    );
    return new SuccessResponse('Successfully updated roadmap category.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the roadmap category.' })
  async remove(@Param('id') id: string) {
    await this.roadmapCategoryService.deleteRoadmapCategory(+id);
    return new SuccessResponse('Successfully deleted roadmap category.');
  }
}
