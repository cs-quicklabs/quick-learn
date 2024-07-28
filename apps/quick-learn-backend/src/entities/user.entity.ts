import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';
import { TeamEntity } from './team.entity';
import { UserTypeEntity } from './user_type.entity';
import { BaseEntity } from './BaseEntity';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Generated('uuid')
  @Column({ type: 'varchar', unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ name: 'display_name', length: '150', nullable: true })
  private _display_name: string;

  @Expose()
  get display_name(): string {
    return this._display_name || `${this.first_name} ${this.last_name}`;
  }

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  alert_enabled: boolean;

  @Column({ nullable: true })
  team_id: number;

  @ManyToOne(() => TeamEntity, (team) => team.users)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ nullable: true })
  user_type_id: number;

  @ManyToOne(() => UserTypeEntity, (user) => user.users)
  @JoinColumn({ name: 'user_type_id' })
  user_type: UserTypeEntity;

  @DeleteDateColumn()
  deleted_at: Date;
}
