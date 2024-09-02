import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TeamEntity } from './team.entity';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from './user.entity';

@Entity({ name: 'skill' })
export class SkillEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @ManyToOne(() => TeamEntity, (team) => team.skills)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @OneToMany(() => UserEntity, (user) => user.skill)
  users: UserEntity[];
}
