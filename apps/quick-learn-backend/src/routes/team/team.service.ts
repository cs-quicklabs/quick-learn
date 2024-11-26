import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from '@src/entities/team.entity';
import { Repository } from 'typeorm';
import { BasicCrudService } from '@src/common/services';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileService } from '@src/file/fileService.service';
@Injectable()
export class TeamService extends BasicCrudService<TeamEntity> {
  constructor(@InjectRepository(TeamEntity) repo: Repository<TeamEntity>,
  private readonly FileService: FileService
) {
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
    // ON PROFILE CHANGE VERIFY IF LOGO HAS CHANGED
    if((user.team.logo !== payload.logo) && (user.team.logo !== "" && user.team.logo !== null)) {
      // DELETE OLD LOGO FROM S3 BUCKET
      await this.FileService.deleteFiles([user.team.logo]);
    }    
    await this.update({ id: teamId }, payload);
  }
}
