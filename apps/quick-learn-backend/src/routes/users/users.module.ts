import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@src/common/modules';
import { SkillEntity, UserEntity, UserTypeEntity } from '@src/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTypeEntity, SkillEntity]),
    EmailModule,
    AuthModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
