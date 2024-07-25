import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity()
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  name: string;

  @Column()
  team_id: number;
  @ManyToOne(() => TeamEntity, (team) => team.skills)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @UpdateDateColumn()
  updated_at: Date;
}
