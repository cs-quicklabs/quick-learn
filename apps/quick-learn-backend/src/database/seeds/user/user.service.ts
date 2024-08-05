import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeIdEnum } from '@quick-learn/shared';
import { UserEntity } from '@src/entities/user.entity';
import { Repository } from 'typeorm';
import { TeamService } from '../team/team.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private teamService: TeamService,
  ) {}

  async run() {
    const team = await this.teamService.getTeam();
    const superAdmin = await this.repository.count({
      where: { user_type_id: UserTypeIdEnum.SUPERADMIN },
    });
    if (!superAdmin) {
      const user = {
        first_name: 'Super',
        last_name: 'Admin',
        user_type_id: UserTypeIdEnum.SUPERADMIN,
        email: 'super.admin@yopmail.com',
        password: 'password@123P',
        team_id: team.id,
      };
      const superAdminUser = await this.repository.create(user);
      await this.repository.save(superAdminUser);
    }
  }
}
