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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { en } from '@src/lang/en';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserTypeId } from '@src/common/enum/user_role.enum';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/skills
@ApiTags('Skills')
@Roles(UserTypeId.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
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
    const skills = await this.skillsService.getMany({}, { name: 'ASC' });
    return new SuccessResponse('Primary skill has been added successfully.', {
      skills,
    });
  }

  @Get()
  @ApiOperation({ summary: 'get all skills' })
  async findAll() {
    const skills = await this.skillsService.getMany({}, { name: 'ASC' });
    return new SuccessResponse('Successfully retrieved primary skills.', {
      skills,
    });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiOperation({ summary: 'Edit skill by id' })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    await this.skillsService.updateSkill(+id, updateSkillDto);
    return new SuccessResponse(en.successSkillUpdate);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiOperation({ summary: 'Delete skill by id' })
  async remove(@Param('id') id: string) {
    await this.skillsService.deleteSkill(+id);
    return new SuccessResponse(en.successSkillDelete);
  }
}
