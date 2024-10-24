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
import { RoadmapService } from './roadmap.service';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { JwtAuthGuard } from '../auth/guards';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';
import { AssignCoursesToRoadmapDto } from './dto/assing-courses-to-roadmap';
import { PaginationDto } from '../users/dto';
import { ActivateRoadmapDto } from './dto/activate-roadmap.dto';

@ApiTags('Roadmap')
@Controller({
  path: 'roadmap',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly service: RoadmapService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roadmaps' })
  async getRoadmap() {
    const roadmaps = await this.service.getAllRoadmaps();
    return new SuccessResponse(en.GetAllRoapmaps, roadmaps);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new roadmap' })
  async createRoadmap(
    @Body() createRoadmapDto: CreateRoadmapDto,
    @CurrentUser() user: UserEntity,
  ) {
    const roadmap = await this.service.createRoadmap(createRoadmapDto, user);
    return new SuccessResponse(en.CreateRoadmap, roadmap);
  }

  @Post('archived')
  @ApiOperation({ summary: 'Get Archived Roadmaps' })
  async findAllArchivedRoadmaps(
    @CurrentUser() user: UserEntity,
    @Body() paginationDto: PaginationDto,
  ) {
    const roadmaps = await this.service.findAllArchived(user, paginationDto);
    return new SuccessResponse(en.GetAllRoapmaps, roadmaps);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate or archive roadmap' })
  async activateRoadmap(
    @Body() activateRoadmapDto: ActivateRoadmapDto,
  ): Promise<SuccessResponse> {
    const { active, id } = activateRoadmapDto;
    const updatedRoadmap = await this.service.updateRoadmap(id, { active });
    return new SuccessResponse(en.RoadmapStatusUpdated, updatedRoadmap);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Roadmap ID', required: true })
  @ApiOperation({ summary: 'Get roadmap details' })
  async getRoadmapDetails(
    @Param('id') id: string,
    @Query('courseId') courseId?: string,
  ) {
    const roadmaps =
      await this.service.getRoadmapDetailsWithCourseAndLessonsCount(
        +id,
        courseId ? +courseId : undefined,
      );
    return new SuccessResponse(en.GetAllRoapmaps, roadmaps);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Roadmap ID', required: true })
  @ApiOperation({ summary: 'Update a roadmap' })
  async updateRoadmap(
    @Param('id') id: string,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    const roadmap = await this.service.updateRoadmap(+id, updateRoadmapDto);
    return new SuccessResponse(en.updateRoadmap, roadmap);
  }

  @Patch(':id/assign')
  @ApiParam({ name: 'id', description: 'Roadmap ID', required: true })
  @ApiOperation({ summary: 'Assign courses to roadmap' })
  async assignCoursesRoadmap(
    @Param('id') id: string,
    @Body() assignCoursesToRoadmapDto: AssignCoursesToRoadmapDto,
  ) {
    await this.service.assignRoadmap(+id, assignCoursesToRoadmapDto);
    return new SuccessResponse(en.RoadmapCoursesAssigned);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Roadmap id', required: true })
  @ApiOperation({ summary: 'Delete a roadmap' })
  async archiveRoadmap(@Param('id') id: string) {
    await this.service.archiveRoadmap(+id);
    return new SuccessResponse(en.archiveRoadmap);
  }
}
