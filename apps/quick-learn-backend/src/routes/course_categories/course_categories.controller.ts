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
import { CourseCategoriesService } from './course_categories.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course_category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuccessResponse } from '@src/common/dto';

@ApiTags('Course Categories')
@UseGuards(JwtAuthGuard)
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/course-categories
@Controller({
  version: '1',
  path: 'course-categories',
})
export class CourseCategoriesController {
  constructor(
    private readonly courseCategoriesService: CourseCategoriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'adding course category' })
  async create(
    @Body() createCourseCategoryDto: CreateCourseCategoryDto,
  ): Promise<SuccessResponse> {
    const courseCategory = await this.courseCategoriesService.create(
      createCourseCategoryDto,
    );
    const courseCategories = await this.courseCategoriesService.findAll();
    return new SuccessResponse('Successfully added course category', {
      categories: courseCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'get all course categories' })
  async findAll() {
    const courseCategories = await this.courseCategoriesService.findAll();
    return new SuccessResponse('Course Categories', {
      categories: courseCategories,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    return this.courseCategoriesService.update(+id, updateCourseCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseCategoriesService.remove(+id);
  }
}
