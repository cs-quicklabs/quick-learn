import {
  Body,
  Controller,
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
    const data = await this.service.getCourseDetails({ id: +id });
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
    return new SuccessResponse(en.CreateRoadmap);
  }
}
