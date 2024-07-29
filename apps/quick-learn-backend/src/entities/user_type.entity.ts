import { Entity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'user_type' })
export class UserTypeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => UserEntity, (user) => user.user_type)
  users: UserEntity[];
}
