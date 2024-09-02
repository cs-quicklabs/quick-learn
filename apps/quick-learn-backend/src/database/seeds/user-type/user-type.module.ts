import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeService } from './user-type.service';
import { UserTypeEntity } from '@src/entities';
@Module({
  imports: [TypeOrmModule.forFeature([UserTypeEntity])],
  providers: [UserTypeService],
})
export class UserTypeModule {}
