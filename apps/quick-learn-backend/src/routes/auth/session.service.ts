import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { SessionEntity } from '@src/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService extends BasicCrudService<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    repo: Repository<SessionEntity>,
  ) {
    super(repo);
  }
}
