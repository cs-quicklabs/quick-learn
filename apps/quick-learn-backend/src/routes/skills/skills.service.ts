import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from '@src/entities/skill.entity';
import { ILike, Repository } from 'typeorm';
import { BasicCrudService } from '@src/common/services';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { UserEntity } from '@src/entities';
import { en } from '@src/lang/en';

@Injectable()
export class SkillsService extends BasicCrudService<SkillEntity> {
  constructor(@InjectRepository(SkillEntity) repo: Repository<SkillEntity>) {
    super(repo);
  }

  async createSkill(createSkillDto: CreateSkillDto, user: UserEntity) {
    const foundSkill = await this.repository.count({
      where: { name: ILike(createSkillDto.name), team_id: user.team_id },
    });

    if (foundSkill) {
      throw new BadRequestException('Primary skill already exists.');
    }

    const skill = this.repository.create({
      ...createSkillDto,
      team_id: user.team_id,
    });
    return await this.repository.save(skill);
  }

  async updateSkill(
    id: number,
    updateSkillDto: UpdateSkillDto,
    team_id: UserEntity['team_id'],
  ) {
    const skill = await this.get({ id, team_id });
    const skillByName = await this.get({
      name: ILike(updateSkillDto.name),
      team_id,
    });
    const isDifferentSkill = skillByName && skillByName.id !== skill.id;

    if (isDifferentSkill) {
      throw new BadRequestException(en.skillAlreadyExists);
    }
    await this.update({ id }, updateSkillDto);
  }

  async deleteSkill(id: number, team_id: UserEntity['team_id']) {
    const skill = await this.get({ id, team_id }, ['users']);
    if (skill.users.length) {
      throw new BadRequestException('Skill is assigned to user.');
    }
    return await this.delete({ id });
  }
}
