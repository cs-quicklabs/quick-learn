import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '@src/entities/team.entity';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  exports: [TeamService],
})
export class TeamModule {}
