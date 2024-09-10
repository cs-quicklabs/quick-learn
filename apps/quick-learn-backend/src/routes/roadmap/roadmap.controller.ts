import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

@ApiTags('Roadmap')
@Controller({
  path: 'roadmap',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private service: RoadmapService) {}

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

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Roadmap ID', required: true })
  @ApiOperation({ summary: 'Get roadmap details' })
  async getRoadmapDetails(@Param('id') id: string) {
    const roadmaps = await this.service.getRoadmapDetails({ id: +id });
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
    return new SuccessResponse(en.CreateRoadmap, roadmap);
  }
}
