import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from '@src/entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    const foundSkill = await this.skillRepository.count({
      where: { name: createSkillDto.name },
    });

    if (foundSkill) {
      throw new BadRequestException('Skill already exists');
    }

    const skill = await this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll() {
    return await this.skillRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
