import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'session',
})
export class SessionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  hash: string;

  @Column({ type: 'varchar' })
  expires: string;
}
