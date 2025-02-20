import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonTokenEntity } from '@src/entities';
import { LessonTokenService } from './lesson-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([LessonTokenEntity])],
  providers: [LessonTokenService],
  exports: [LessonTokenService],
})
export class LessonTokenModule {}
