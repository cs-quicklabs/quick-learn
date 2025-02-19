import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { UserTypeEntity } from '@src/entities';

@Injectable()
export class UserTypeService extends BasicCrudService<UserTypeEntity> {
  constructor(@InjectRepository(UserTypeEntity) repo) {
    super(repo);
  }
}
