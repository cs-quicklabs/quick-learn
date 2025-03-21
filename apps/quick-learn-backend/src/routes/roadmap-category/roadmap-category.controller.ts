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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserTypeIdEnum } from '@quick-learn/shared';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';

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

  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Adding roadmap category' })
  async create(
    @CurrentUser() user: UserEntity,
    @Body() createRoadmapCategoryDto: CreateRoadmapCategoryDto,
  ): Promise<SuccessResponse> {
    await this.roadmapCategoryService.createRoadmapCategory(
      createRoadmapCategoryDto,
      user,
    );
    const roadmapCategories = await this.roadmapCategoryService.getMany(
      { team_id: user.team_id },
      { name: 'ASC' },
    );
    return new SuccessResponse('Successfully created roadmap category.', {
      categories: roadmapCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all roadmap categories' })
  async findAll(
    @Query() listRoadmapQueryDto: ListRoadmapQueryDto,
    @CurrentUser() user: UserEntity,
  ) {
    const roadmapCategories =
      await this.roadmapCategoryService.getRoadmapCategoryWithRoadmapAndCourses(
        listRoadmapQueryDto.is_roadmap,
        listRoadmapQueryDto.is_courses,
        user,
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

  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
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

  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete the roadmap category.' })
  async remove(@Param('id') id: string) {
    await this.roadmapCategoryService.deleteRoadmapCategory(+id);
    return new SuccessResponse(en.successDeleteRoadmap);
  }
}
