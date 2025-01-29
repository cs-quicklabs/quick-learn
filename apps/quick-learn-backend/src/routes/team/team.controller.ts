import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateTeamDto } from './dto/update-team.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserTypeId } from '@src/common/enum/user_role.enum';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/team
@ApiTags('Team')
@Roles(UserTypeId.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  version: '1',
  path: 'team',
})
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Get()
  @ApiOperation({ summary: 'Get team details' })
  async find(@CurrentUser() user: UserEntity) {
    const team = await this.teamService.getTeamDetails(user);
    return new SuccessResponse('Successfully retrieved team details.', team);
  }

  @Patch()
  @ApiOperation({ summary: 'Update team details' })
  async update(
    @CurrentUser() user: UserEntity,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    await this.teamService.updateTeam(user, updateTeamDto);
    return new SuccessResponse('Successfully updated team details.');
  }
}
