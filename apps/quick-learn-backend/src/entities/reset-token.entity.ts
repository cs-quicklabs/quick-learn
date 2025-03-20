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

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  expiry_date: Date;
}
