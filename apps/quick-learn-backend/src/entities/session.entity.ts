import { Column, Entity, Index, ManyToOne } from 'typeorm';
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
  user: UserEntity;

  @Column()
  hash: string;
}
