import {
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
    const data = await this.service.getAllCourses();
    return new SuccessResponse(en.GetAllCourses, data);
  }

  @Get('/community-course')
  @ApiOperation({ summary: 'Get all community courses' })
  async getCommunityCourses() {
    const data = await this.service.getMany(
      { is_community_available: true, archived: false },
      undefined,
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
        lessons: { archived: false, approved: true },
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
    @CurrentUser() user: UserEntity,
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
    @Body() body: { id: number; active: boolean },
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

  // And update the archive endpoint to match
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Course id', required: true })
  @ApiOperation({ summary: 'Archive a course' })
  async archiveCourse(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ) {
    await this.service.archiveCourse(+id, currentUser);
    return new SuccessResponse(en.archiveCourse);
  }
}
