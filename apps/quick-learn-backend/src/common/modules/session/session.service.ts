import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { SessionEntity } from '@src/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService extends BasicCrudService<SessionEntity> {
  private readonly logger = new Logger(SessionService.name);
  constructor(
    @InjectRepository(SessionEntity)
    repo: Repository<SessionEntity>,
  ) {
    super(repo);
  }

  async deleteAllExpiredSessions() {
    // We're here delete all the expire token and we are typecase as the column was varchar.
    this.logger.log(
      `------------- Deleting all the data which has expired. -------------`,
    );
    const { affected } = await this.repository
      .createQueryBuilder('session')
      .delete()
      .where("expires ~ '^[0-9]+$'")
      .andWhere('TO_TIMESTAMP(CAST(expires AS bigint) / 1000) < NOW()')
      .execute();
    this.logger.log(`------------- Deleted ${affected} rows. -------------`);
  }
}
