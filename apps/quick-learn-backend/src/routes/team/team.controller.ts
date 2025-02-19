import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { TeamService } from './team.service';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateTeamDto } from './dto/update-team.dto';
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/team
@ApiTags('Team')
@Controller({
  version: '1',
  path: 'team',
})
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

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
