import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from './user.entity';

@Entity({ name: 'reset_token' })
export class ResetTokenEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  token: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  expiry_date: Date;
}
