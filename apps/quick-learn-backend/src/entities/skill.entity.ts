import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TeamEntity } from './team.entity';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'skill' })
export class SkillEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250, nullable: true })
  name: string;

  @Column()
  team_id: number;

  @ManyToOne(() => TeamEntity, (team) => team.skills)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
