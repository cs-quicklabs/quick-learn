import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from '@src/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const foundTeam = await this.teamRepository.count({
      where: { name: createTeamDto.name },
    });
    if (foundTeam) {
      throw new BadRequestException('Team already exists');
    }
    const team = await this.teamRepository.create(createTeamDto);
    return await this.teamRepository.save(team);
  }

  async findAll() {
    return await this.teamRepository.find();
  }
}
