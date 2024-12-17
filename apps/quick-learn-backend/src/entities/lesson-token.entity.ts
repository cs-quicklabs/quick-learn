import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('lesson_tokens')
export class LessonTokenEntity extends BaseEntity {
  @Column()
  token: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  lesson_id: number;

  @Column({ type: 'int', nullable: false })
  course_id: number;

  @Column({ type: 'varchar', nullable: false, default: 'pending' })
  status: string;

  @Column()
  expiresAt: Date;
}
