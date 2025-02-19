import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@src/common/modules';
import { UserEntity, UserTypeEntity } from '@src/entities';
import { AuthModule } from '../auth/auth.module';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { CourseModule } from '../course/course.module';
import { LessonModule } from '../lesson/lesson.module';
import { FileModule } from '@src/file/file.module';
import { SkillsModule } from '../skills/skills.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTypeEntity]),
    EmailModule,
    AuthModule,
    RoadmapModule,
    CourseModule,
    LessonModule,
    FileModule,
    SkillsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
