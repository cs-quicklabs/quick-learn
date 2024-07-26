import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SkillEntity } from './skill.entity';

@Entity()
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => UserEntity, (user) => user.team)
  users: UserEntity[];

  @OneToMany(() => SkillEntity, (skill) => skill.team)
  skills: SkillEntity[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
