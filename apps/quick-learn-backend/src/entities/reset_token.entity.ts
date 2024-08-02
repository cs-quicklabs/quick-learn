import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'reset_token' })
export class ResetTokenEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  token: string;

  @Column()
  user_id: string;

  @Column({ default: true })
  active: boolean;
}
