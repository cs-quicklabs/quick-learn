import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { ResetTokenEntity } from '@src/entities';

@Injectable()
export class ResetTokenService extends BasicCrudService<ResetTokenEntity> {
  constructor(@InjectRepository(ResetTokenEntity) repo) {
    super(repo);
  }
}
