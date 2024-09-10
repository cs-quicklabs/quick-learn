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
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { CourseCategoryService } from './course-category.service';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/course-categories
@ApiTags('Course Categories')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'course-categories',
})
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create course category.' })
  async create(
    @Body() createCourseCategoryDto: CreateCourseCategoryDto,
  ): Promise<SuccessResponse> {
    await this.courseCategoryService.create(createCourseCategoryDto);
    const courseCategories = await this.courseCategoryService.getMany(
      {},
      { name: 'ASC' },
    );
    return new SuccessResponse('Successfully added course category', {
      categories: courseCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all course categories.' })
  async findAll() {
    const courseCategories = await this.courseCategoryService.getMany(
      {},
      { name: 'ASC' },
    );
    return new SuccessResponse('Course Categories', {
      categories: courseCategories,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the course category details.' })
  findOne(@Param('id') id: string) {
    return this.courseCategoryService.get({ id: +id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the course category.' })
  @ApiParam({ name: 'id', type: 'string' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    await this.courseCategoryService.createCourseCategory(
      +id,
      updateCourseCategoryDto,
    );
    return new SuccessResponse('Successfully updated course category.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the course category.' })
  async remove(@Param('id') id: string) {
    await this.courseCategoryService.delete({ id: +id });
    return new SuccessResponse('Successfully deleted course category.');
  }
}
