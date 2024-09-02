import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { UserService } from './user.service';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [TeamModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
})
export class UserModule {}
