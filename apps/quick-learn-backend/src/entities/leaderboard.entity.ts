import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LeaderboardTypeEnum } from '@src/common/constants/constants';
import { TeamEntity } from './team.entity';

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

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @OneToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
