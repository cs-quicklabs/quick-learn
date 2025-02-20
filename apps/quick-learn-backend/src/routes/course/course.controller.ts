import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BasePaginationDto, SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { JwtAuthGuard } from '../auth/guards';
import { CreateCourseDto } from './dto/create-course.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignRoadmapsToCourseDto } from './dto/assign-roadmaps-to-course.dto';
import { PaginationDto } from '../users/dto';
import { CourseArchiveDto } from './dto/course-archive.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { Roles } from '@src/common/decorators/roles.decorator';
import { CourseParamDto } from './dto/course-param.dto';

@ApiTags('Course')
@Controller({
  path: 'course',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @UseGuards(RolesGuard)
  @Roles(UserTypeId.SUPER_ADMIN)
  @Get('/community-course')
  @ApiOperation({ summary: 'Get all community courses' })
  async getCommunityCourses() {
    const data = await this.service.getContentRepoCourses(
      { mode: 'all' },
      { is_community_available: true, archived: false },
      ['created_by'],
    );
    return new SuccessResponse(en.getCommunityCourse, data);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Get Archived Courses' })
  async findAllArchivedCourses(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const courses = await this.service.getArchivedCourses(paginationDto, [
      'updated_by',
      'course_category',
    ]);
    return new SuccessResponse(en.successGotArchivedCourses, courses);
  }

  @UseGuards(RolesGuard)
  @Roles(UserTypeId.SUPER_ADMIN, UserTypeId.ADMIN, UserTypeId.EDITOR)
  @Get('orphan')
  @ApiOperation({ summary: 'Get Orphan courses' })
  async orphanCourse(@Query() params: BasePaginationDto) {
    const response = await this.service.getOrphanCourses(
      params.page,
      params.limit,
      params.q,
    );
    return new SuccessResponse('Successfully got Orphan courses', response);
  }

  @Get('/community/:id')
  @ApiOperation({ summary: 'Get course details' })
  async getcourseDetails(@Param() param: CourseParamDto) {
    const data = await this.service.getCourseDetails(
      { id: +param.id, is_community_available: true },
      ['lessons', 'lessons.created_by_user'],
      { isCommunity: true },
    );
    return new SuccessResponse(en.GetCourseDetails, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course details' })
  async getRoadmapDetails(@Param() param: CourseParamDto) {
    const data = await this.service.getCourseDetails(
      { id: +param.id },
      ['lessons', 'lessons.created_by_user'],
      { countParticipant: true },
    );
    return new SuccessResponse(en.GetCourseDetails, data);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  async createRoadmap(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: UserEntity,
  ) {
    const data = await this.service.createCourse(user, createCourseDto);
    return new SuccessResponse(en.CreateCourse, data);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'course id', required: true })
  @ApiOperation({ summary: 'Update a course' })
  async updateRoadmap(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    await this.service.updateCourse(+id, updateCourseDto);
    return new SuccessResponse(en.UpdateCourse);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign a roadmaps to course' })
  async assignRoadmapCourse(
    @Param() param: CourseParamDto,
    @Body() assignRoadmapsToCourseDto: AssignRoadmapsToCourseDto,
  ) {
    await this.service.assignRoadmapCourse(
      +param.id,
      assignRoadmapsToCourseDto,
    );
    return new SuccessResponse(en.UpdateCourse);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate or archive course' })
  async activateCourse(
    @Body() body: CourseArchiveDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.updateCourseArchiveStatus(
      body.id,
      !body.active, // Convert active to archived
      currentUser,
    );
    return new SuccessResponse(
      body.active ? en.unarchiveCourse : en.archiveCourse,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course permanently' })
  async deleteCourse(@Param() param: CourseParamDto): Promise<SuccessResponse> {
    await this.service.deleteCourse(+param.id);
    return new SuccessResponse(en.CourseDeleted);
  }
}
