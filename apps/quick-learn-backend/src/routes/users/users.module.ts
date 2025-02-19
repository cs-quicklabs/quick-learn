import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule, SessionModule } from '@src/common/modules';
import { UserEntity, UserTypeEntity } from '@src/entities';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { CourseModule } from '../course/course.module';
import { LessonModule } from '../lesson/lesson.module';
import { FileModule } from '@src/file/file.module';
import { SkillsModule } from '../skills/skills.module';
import { UserTypeService } from './user-type.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserTypeService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTypeEntity]),
    EmailModule,
    SessionModule,
    RoadmapModule,
    CourseModule,
    LessonModule,
    FileModule,
    SkillsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
