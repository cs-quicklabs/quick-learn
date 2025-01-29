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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';
import { AssignCoursesToRoadmapDto } from './dto/assing-courses-to-roadmap';
import { PaginationDto } from '../users/dto';
import { ActivateRoadmapDto } from './dto/activate-roadmap.dto';
import { roadmapParamsDto } from './dto/roadmap-params.dto';

@ApiTags('Roadmap')
@Controller({
  path: 'roadmap',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly service: RoadmapService) { }

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

  @Get('archived')
  @ApiOperation({ summary: 'Get Archived Roadmaps' })
  async findAllArchivedRoadmaps(@Query() paginationDto: PaginationDto) {
    const roadmaps = await this.service.findAllArchived(paginationDto);
    return new SuccessResponse(en.GetAllRoapmaps, roadmaps);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate or archive roadmap' })
  async activateRoadmap(
    @Body() activateRoadmapDto: ActivateRoadmapDto,
    @CurrentUser('id') userID: number,
  ): Promise<SuccessResponse> {
    const { active, id } = activateRoadmapDto;
    const updatedRoadmap = await this.service.updateRoadmap(
      id,
      { active },
      userID,
    );
    return new SuccessResponse(en.RoadmapStatusUpdated, updatedRoadmap);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get roadmap details' })
  async getRoadmapDetails(
    @Param() params: roadmapParamsDto,
    @Query('courseId') courseId?: string,
  ) {
    const roadmaps =
      await this.service.getRoadmapDetailsWithCourseAndLessonsCount(
        +params.id,
        courseId ? +courseId : undefined,
      );
    return new SuccessResponse(en.GetAllRoapmaps, roadmaps);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a roadmap' })
  async updateRoadmap(
    @Param() Params: roadmapParamsDto,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
    @CurrentUser('id') userID: number,
  ) {
    const roadmap = await this.service.updateRoadmap(
      +Params.id,
      updateRoadmapDto,
      userID,
    );
    return new SuccessResponse(en.updateRoadmap, roadmap);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign courses to roadmap' })
  async assignCoursesRoadmap(
    @Param() params: roadmapParamsDto,
    @Body() assignCoursesToRoadmapDto: AssignCoursesToRoadmapDto,
  ) {
    await this.service.assignRoadmap(+params.id, assignCoursesToRoadmapDto);
    return new SuccessResponse(en.RoadmapCoursesAssigned);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently delete roadmap' })
  async deleteRoadmap(@Param() params: roadmapParamsDto) {
    await this.service.delete({ id: +params.id });
    return new SuccessResponse(en.successDeleteRoadmap);
  }
}
