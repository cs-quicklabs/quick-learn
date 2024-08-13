import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { SuccessResponse } from '@src/common/dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@UseGuards(JwtAuthGuard)
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/team
@Controller({
  version: '1',
  path: 'team',
})
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: 'adding team name' })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<SuccessResponse> {
    const team = await this.teamService.create(createTeamDto);

    return new SuccessResponse('Successfully added Team', team);
  }

  @Get()
  @ApiOperation({ summary: 'get all team names' })
  async findAll() {
    const team = await this.teamService.findAll();
    return new SuccessResponse('Teams', {
      teams: team,
    });
  }
}
