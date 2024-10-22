import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { UserService } from './user.service';
import { TeamModule } from '../team/team.module';
import { SkillModule } from '../skill/skill.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TeamModule, SkillModule],
  providers: [UserService],
})
export class UserModule {}
