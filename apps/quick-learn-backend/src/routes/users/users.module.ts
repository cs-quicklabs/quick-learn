import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
=======
>>>>>>> 71ee2d5 (seting entities and defining endpoints)

@Module({
  controllers: [UsersController],
  providers: [UsersService],
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersService],
=======
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
})
export class UsersModule {}
