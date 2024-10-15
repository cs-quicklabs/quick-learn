import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { SkillEntity } from '@src/entities';
import { Repository } from 'typeorm';
import { TeamService } from '../team/team.service';

@Injectable()
export class SkillService extends BasicCrudService<SkillEntity> {
  constructor(
    @InjectRepository(SkillEntity) repo: Repository<SkillEntity>,
    private readonly teamService: TeamService,
  ) {
    super(repo);
  }

  async run() {
    const countSkill = await this.repository.count();
    if (!countSkill) {
      const team = await this.teamService.getTeam();
      const skill: Partial<SkillEntity> = {
        name: 'Crownstack Test',
        team_id: team.id,
      };
      await this.create(skill);
    }
  }
}
