import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from '@src/entities/team.entity';
import { Repository } from 'typeorm';
import { BasicCrudService } from '@src/common/services';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService extends BasicCrudService<TeamEntity> {
  constructor(@InjectRepository(TeamEntity) repo: Repository<TeamEntity>) {
    super(repo);
  }

  async getTeamDetails(user: UserEntity) {
    const teamId = user.team_id;
    if (!teamId) {
      throw new BadRequestException('No team has assigned to the user.');
    }
    return await this.get({ id: teamId });
  }

  async updateTeam(user: UserEntity, payload: UpdateTeamDto) {
    const teamId = user.team_id;
    if (!teamId) {
      throw new BadRequestException('No team has assigned to the user.');
    }
    await this.update({ id: teamId }, payload);
  }
}
