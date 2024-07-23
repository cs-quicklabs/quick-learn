import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { TeamEntity } from './team.entity';
import { UserTypeEntity } from './user_type.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  @Column({ type: 'varchar', length: 50 })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

<<<<<<< HEAD
  @Column({ type: 'varchar', length: 500, nullable: true })
  accessToken: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken: string;

=======
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  alert_enabled: boolean;

<<<<<<< HEAD
  @Column({ nullable: true })
=======
  @Column()
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
  team_id: number;
  @ManyToOne(() => TeamEntity, (team) => team.users)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

<<<<<<< HEAD
  @Column({ nullable: true })
=======
  @Column()
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
  user_type_id: number;
  @ManyToOne(() => UserTypeEntity, (user) => user.users)
  @JoinColumn({ name: 'user_type_id' })
  user_type: UserTypeEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
