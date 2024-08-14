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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuccessResponse } from '@src/common/dto';

@ApiTags('Skills')
@UseGuards(JwtAuthGuard)
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/skills
@Controller({
  version: '1',
  path: 'skills',
})
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'adding skill name' })
  async create(
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<SuccessResponse> {
    await this.skillsService.create(createSkillDto);
    const skills = await this.skillsService.findAll();
    return new SuccessResponse('Successfully added Skill', { skills });
  }

  @Get()
  @ApiOperation({ summary: 'get all skills' })
  async findAll() {
    const skills = await this.skillsService.findAll();
    return new SuccessResponse('Skills Listed', { skills });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.skillsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
