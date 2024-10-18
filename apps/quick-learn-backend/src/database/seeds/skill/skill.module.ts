import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillEntity } from '@src/entities';
import { SkillService } from './skill.service';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity]), TeamModule],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
