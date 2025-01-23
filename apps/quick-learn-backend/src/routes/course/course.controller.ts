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
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { Roles } from '@src/common/decorators/roles.decorator';

@ApiTags('Course')
@Controller({
  path: 'course',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private service: CourseService) {}

  @UseGuards(RolesGuard)
  @Roles(UserTypeId.SUPER_ADMIN)
  @Get('/community-course')
  @ApiOperation({ summary: 'Get all community courses' })
  async getCommunityCourses() {
    const data = await this.service.getContentRepoCourses(
      { page: 1, limit: 10, mode: 'all' },
      { is_community_available: true },
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
    const data = await this.service.getCourseDetails(
      { id: +id },
      ['lessons', 'lessons.created_by_user'],
      { countParticipant: true },
    );
    return new SuccessResponse(en.GetCourseDetails, data);
  }

  @Get('/community/:id')
  @ApiParam({ name: 'id', description: 'course id', required: true })
  @ApiOperation({ summary: 'Get course details' })
  async getcourseDetails(@Param('id') id: string) {
    const data = await this.service.getCourseDetails(
      { id: +id, is_community_available: true },
      ['lessons', 'lessons.created_by_user'],
      { isCommunity: true },
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
