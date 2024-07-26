import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
<<<<<<< HEAD
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
=======
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)

@Module({
  controllers: [UsersController],
  providers: [UsersService],
<<<<<<< HEAD
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersService],
=======
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
=======
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersService],
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)
})
export class UsersModule {}
