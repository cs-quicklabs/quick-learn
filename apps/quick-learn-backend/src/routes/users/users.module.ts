import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { UserTypeEntity } from '@src/entities/user_type.entity';
import { SkillEntity } from '@src/entities/skill.entity';
import { EmailModule } from '@src/common/modules';

@Module({
  controllers: [UsersController, EmailModule],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTypeEntity, SkillEntity]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
