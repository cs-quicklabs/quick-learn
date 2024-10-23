import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@src/common/modules';
import { SkillEntity, UserEntity, UserTypeEntity } from '@src/entities';
import { AuthModule } from '../auth/auth.module';
import { RoadmapModule } from '../roadmap/roadmap.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTypeEntity, SkillEntity]),
    EmailModule,
    AuthModule,
    RoadmapModule,
  ],
  exports: [UsersService],
})
export class UsersModule { }
