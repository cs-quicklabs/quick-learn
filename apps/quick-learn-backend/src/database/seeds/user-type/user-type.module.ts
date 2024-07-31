import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeEntity } from '@src/entities/user_type.entity';
import { UserTypeService } from './user-type.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserTypeEntity])],
  providers: [UserTypeService],
})
export class UserTypeModule {}
