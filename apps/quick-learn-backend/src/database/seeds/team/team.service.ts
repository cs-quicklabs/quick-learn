import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { TeamEntity } from '@src/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService extends BasicCrudService<TeamEntity> {
  constructor(@InjectRepository(TeamEntity) repo: Repository<TeamEntity>) {
    super(repo);
  }

  async run() {
    const countTeam = await this.repository.count();
    if (!countTeam) {
      const team: Partial<TeamEntity> = {
        name: 'Crownstack Skilling Up',
      };
      await this.create(team);
    }
  }

  async getTeam(): Promise<TeamEntity> {
    const teams = await this.getMany();
    if (teams.length > 0) {
      return teams[0];
    } else {
      throw new NotFoundException('Team not found.');
    }
  }
}
