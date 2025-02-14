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
import { CourseCategoryParamDto } from './dto/course-category-param.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserTypeIdEnum } from '@quick-learn/shared';

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
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
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
  findOne(@Param() param: CourseCategoryParamDto) {
    return this.courseCategoryService.get({ id: +param.id });
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update the course category.' })
  async update(
    @Param() param: CourseCategoryParamDto,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    await this.courseCategoryService.createCourseCategory(
      +param.id,
      updateCourseCategoryDto,
    );
    return new SuccessResponse(en.successUpdateCourse);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete the course category.' })
  async remove(@Param() param: CourseCategoryParamDto) {
    await this.courseCategoryService.deleteCourseCategory(+param.id);
    return new SuccessResponse(en.successDeleteCourse);
  }
}
