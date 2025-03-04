import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services';
import { FlaggedLessonEntity } from '@src/entities';

@Injectable()
export class FlaggedLessonService extends PaginationService<FlaggedLessonEntity> {
  constructor(@InjectRepository(FlaggedLessonEntity) repo) {
    super(repo);
  }
}
