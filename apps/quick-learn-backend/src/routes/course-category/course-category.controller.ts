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
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';

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
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.courseCategoryService.createCourseCategory(
      createCourseCategoryDto,
      user,
    );

    const courseCategories = await this.courseCategoryService.getMany(
      { team_id: user.team_id },
      { name: 'ASC' },
    );

    return new SuccessResponse('Successfully added course category', {
      categories: courseCategories,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all course categories.' })
  async findAll(@CurrentUser() user: UserEntity) {
    const courseCategories = await this.courseCategoryService.getMany(
      { team_id: user.team_id },
      { name: 'ASC' },
    );
    return new SuccessResponse('Course Categories', {
      categories: courseCategories,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the course category details.' })
  findOne(
    @Param() param: CourseCategoryParamDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.courseCategoryService.get({
      id: +param.id,
      team_id: user.team_id,
    });
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update the course category.' })
  async update(
    @Param() param: CourseCategoryParamDto,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
    @CurrentUser() user: UserEntity,
  ) {
    await this.courseCategoryService.updateCourseCategory(
      +param.id,
      updateCourseCategoryDto,
      user.team_id,
    );
    return new SuccessResponse(en.successUpdateCourse);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete the course category.' })
  async remove(
    @Param() param: CourseCategoryParamDto,
    @CurrentUser() user: UserEntity,
  ) {
    await this.courseCategoryService.deleteCourseCategory(
      +param.id,
      user.team_id,
    );
    return new SuccessResponse(en.successDeleteCourse);
  }
}
