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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { CourseCategoryService } from './course-category.service';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { en } from '@src/lang/en';
import { CourseCategoryParamsDto } from './dto/courseCategoryParams.dto';

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
  findOne(@Param() params: CourseCategoryParamsDto) {
    return this.courseCategoryService.get({ id: +params.id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the course category.' })
  async update(
    @Param() params: CourseCategoryParamsDto,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    await this.courseCategoryService.createCourseCategory(
      +params.id,
      updateCourseCategoryDto,
    );
    return new SuccessResponse(en.successUpdateCourse);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the course category.' })
  async remove(@Param() params: CourseCategoryParamsDto) {
    await this.courseCategoryService.deleteCourseCategory(+params.id);
    return new SuccessResponse(en.successDeleteCourse);
  }
}
