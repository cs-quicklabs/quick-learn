import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { JwtAuthGuard } from '../auth/guards';
import { CreateCourseDto } from './dto/create-course.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignRoadmapsToCourseDto } from './dto/assign-roadmaps-to-course.dto';
import { PaginationDto } from '../users/dto';
import { CourseArchiveDto } from './dto/course-archive.dto';

@ApiTags('Course')
@Controller({
  path: 'course',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private service: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  async getRoadmap(): Promise<SuccessResponse> {
    const data = await this.service.getMany();
    return new SuccessResponse(en.GetAllCourses, data);
  }

  @Get('/my-courses')
  @ApiOperation({ summary: 'Get all assigned roadmap courses' })
  async getMyCourses(@CurrentUser() user: UserEntity) {
    // CHECK IF USER IS LOGGED IN
    if (!user.id) {
      throw new BadRequestException(en.userNotFound);
    }
    const data = await this.service.getUserAssignedRoadmapCourses(user.id);
    return new SuccessResponse(en.GetAllCourses, data);
  }

  @Get('/community-course')
  @ApiOperation({ summary: 'Get all community courses' })
  async getCommunityCourses() {
    const data = await this.service.getAllCourses(
      { is_community_available: true, archived: false },
      ['created_by'],
    );
    return new SuccessResponse(en.getCommunityCourse, data);
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

  @Get(':id')
  @ApiParam({ name: 'id', description: 'course id', required: true })
  @ApiOperation({ summary: 'Get course details' })
  async getRoadmapDetails(@Param('id') id: string) {
    const data = await this.service.getCourseDetails({ id: +id }, [
      'lessons',
      'lessons.created_by_user',
    ]);
    return new SuccessResponse(en.GetCourseDetails, data);
  }

  @Get('/community/:id')
  @ApiParam({ name: 'id', description: 'course id', required: true })
  @ApiOperation({ summary: 'Get course details' })
  async getcourseDetails(@Param('id') id: string) {
    const data = await this.service.getCourseDetails(
      {
        id: +id,
        is_community_available: true,
      },
      ['lessons', 'lessons.created_by_user'],
    );
    return new SuccessResponse(en.GetCourseDetails, data);
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
  @ApiParam({ name: 'id', description: 'Roadmap ID', required: true })
  @ApiOperation({ summary: 'Assign a roadmaps to course' })
  async assignRoadmapCourse(
    @Param('id') id: string,
    @Body() assignRoadmapsToCourseDto: AssignRoadmapsToCourseDto,
  ) {
    await this.service.assignRoadmapCourse(+id, assignRoadmapsToCourseDto);
    return new SuccessResponse(en.UpdateCourse);
  }

  @Post('archived')
  @ApiOperation({ summary: 'Get Archived Courses' })
  async findAllArchivedCourses(
    @Body() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const courses = await this.service.getArchivedCourses(paginationDto, [
      'updated_by',
      'course_category',
    ]);
    return new SuccessResponse(en.successGotArchivedCourses, courses);
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
  @ApiParam({ name: 'id', description: 'course id', required: true })
  @ApiOperation({ summary: 'Delete a course permanently' })
  async deleteCourse(@Param('id') id: string): Promise<SuccessResponse> {
    await this.service.deleteCourse(+id);
    return new SuccessResponse(en.CourseDeleted);
  }
}
