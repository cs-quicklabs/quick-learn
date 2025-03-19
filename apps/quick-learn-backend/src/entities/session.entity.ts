import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'session',
})
export class SessionEntity extends BaseEntity {

  @Column({type:'int'})
  user_id:number


  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  @JoinColumn({name:'user_id'})
  user: UserEntity;

  @Column()
  hash: string;

  @Column({ type: 'varchar' })
  expires: string;
}
