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
import { UserTypeIdEnum } from '@quick-learn/shared';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/skills
@ApiTags('Skills')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'skills',
})
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiOperation({ summary: 'adding skill name' })
  async create(
    @Body() createSkillDto: CreateSkillDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.skillsService.createSkill(createSkillDto, user);
    const skills = await this.skillsService.getMany(
      { team_id: user.team_id },
      { name: 'ASC' },
    );
    return new SuccessResponse('Primary skill has been added successfully.', {
      skills,
    });
  }

  @Get()
  @ApiOperation({ summary: 'get all skills' })
  async findAll(@CurrentUser() user: UserEntity) {
    const skills = await this.skillsService.getMany(
      { team_id: user.team_id },
      { name: 'ASC' },
    );
    return new SuccessResponse('Successfully retrieved primary skills.', {
      skills,
    });
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'Edit skill by id' })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    await this.skillsService.updateSkill(+id, updateSkillDto);
    return new SuccessResponse(en.successSkillUpdate);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'Delete skill by id' })
  async remove(@Param('id') id: string) {
    await this.skillsService.deleteSkill(+id);
    return new SuccessResponse(en.successSkillDelete);
  }
}
