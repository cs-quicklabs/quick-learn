import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateRoadmapCategoryDto } from './dto/create-roadmap-category.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { RoadmapCategoryService } from './roadmap-category.service';
import { UpdateRoadmapCategoryDto } from './dto/update-roadmap-category.dto';
import { en } from '@src/lang/en';
import { ListRoadmapQueryDto } from './dto/list-roadmap-query.dto';
import { FindOptionsWhere } from 'typeorm';
import { RoadmapCategoryEntity } from '@src/entities';

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
  ) { }

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
  async findAll(@Query() listRoadmapQueryDto: ListRoadmapQueryDto) {
    console.log(listRoadmapQueryDto);
    const relations = [];
    let conditions: FindOptionsWhere<RoadmapCategoryEntity> | FindOptionsWhere<RoadmapCategoryEntity>[] = {};
    if (listRoadmapQueryDto.is_roadmap) {
      conditions = [{ roadmaps: { archived: false } }];
      relations.push('roadmaps');
    }
    if (listRoadmapQueryDto.is_courses) {
      conditions = [{
        roadmaps: {
          archived: false, courses: {
            archived: false,

          }
        }
      }];
      relations.push('roadmaps.courses');
    }
    const roadmapCategories = await this.roadmapCategoryService.getMany(
      conditions,
      { name: 'ASC' },
      relations,
    );
    return new SuccessResponse('Successfully retreived roadmap categories.', {
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
    return new SuccessResponse(en.successUpdateRoadmap);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the roadmap category.' })
  async remove(@Param('id') id: string) {
    await this.roadmapCategoryService.deleteRoadmapCategory(+id);
    return new SuccessResponse(en.successDeleteRoadmap);
  }
}
