import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';

@Entity('leaderboard')
export class LeaderboardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ default: 0 })
  lessons_completed_count: number;

  @Column({ nullable: false })
  rank: number;

  @Column({
    enum: LeaderboardTypeEnum,
    default: LeaderboardTypeEnum.WEEKLY,
    nullable: false,
  })
  type: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
