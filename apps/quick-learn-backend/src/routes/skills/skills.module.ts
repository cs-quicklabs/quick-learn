import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillEntity } from '@src/entities/skill.entity';
import { UserEntity } from '@src/entities';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
  imports: [TypeOrmModule.forFeature([SkillEntity, UserEntity])],
  exports: [SkillsService],
})
export class SkillsModule {}
