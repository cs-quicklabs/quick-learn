import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LeaderboardQuarterEnum } from '@src/common/constants/constants';

@Entity('quarterly_leaderboard')
export class QuarterlyLeaderboardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ default: 0 })
  lessons_completed_count: number;

  @Column({ nullable: false })
  rank: number;

  @Column({
    type: 'enum',
    enum: LeaderboardQuarterEnum,
    default: LeaderboardQuarterEnum.Q1,
    nullable: false,
  })
  quarter: LeaderboardQuarterEnum; // Fixed type from number to LeaderboardQuarterEnum

  @Column({
    nullable: false,
    type: 'int', // Changed from 'year' to 'int' to match migration
  })
  year: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
