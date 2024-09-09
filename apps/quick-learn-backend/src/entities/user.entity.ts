import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Generated,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { TeamEntity } from './team.entity';
import { UserTypeEntity } from './user-type.entity';
import { BaseEntity } from './BaseEntity';
import { Exclude, Expose } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { SkillEntity } from './skill.entity';
import { RoadmapEntity } from './roadmap.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Generated('uuid')
  @Column({ type: 'varchar', unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Expose()
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @BeforeInsert()
  // Password hashing
  async hashPassword() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: false })
  team_id: number;

  @ManyToOne(() => TeamEntity, (team) => team.users, { eager: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ type: 'int', nullable: true })
  skill_id: number;

  @ManyToOne(() => SkillEntity, (skill) => skill.users)
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;

  @Column({ nullable: true })
  user_type_id: number;

  @Column({ default: true })
  email_alert_preference: boolean;

  @ManyToOne(() => UserTypeEntity, (user) => user.users, { eager: true })
  @JoinColumn({ name: 'user_type_id' })
  user_type: UserTypeEntity;

  @Column({ type: Date, nullable: true })
  last_login_timestamp: Date;

  @Column({ type: 'varchar', nullable: true })
  profile_image: string;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => RoadmapEntity, (user) => user.created_by)
  roadmaps: RoadmapEntity[];
}
