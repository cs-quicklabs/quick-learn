import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from '@src/entities/skill.entity';
import { ILike, Repository } from 'typeorm';
import { BasicCrudService } from '@src/common/services';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService extends BasicCrudService<SkillEntity> {
  constructor(@InjectRepository(SkillEntity) repo: Repository<SkillEntity>) {
    super(repo);
  }

  async create(createSkillDto: CreateSkillDto) {
    const foundSkill = await this.repository.count({
      where: { name: ILike(createSkillDto.name) },
    });

    if (foundSkill) {
      throw new BadRequestException('Primary skill already exists.');
    }

    const skill = this.repository.create(createSkillDto);
    return await this.repository.save(skill);
  }

  async updateSkill(id: number, updateSkillDto: UpdateSkillDto) {
    const skill = await this.get({ id });
    const skillByName = await this.get({ name: ILike(updateSkillDto.name) });
    const skillNameId = skillByName && skillByName.id !== skill.id;
    if (skillNameId) {
      throw new BadRequestException('Skill already exists.');
    }
    await this.update({ id }, updateSkillDto);
  }

  async deleteSkill(id: number) {
    const skill = await this.get({ id }, ['users']);
    if (skill.users.length) {
      throw new BadRequestException('Skill is assigned to user.');
    }
    return await this.delete({ id });
  }
}
