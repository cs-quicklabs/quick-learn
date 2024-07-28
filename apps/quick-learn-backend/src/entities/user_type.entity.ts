import { Entity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'user_type' })
export class UserTypeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => UserEntity, (user) => user.user_type)
  users: UserEntity[];
}
