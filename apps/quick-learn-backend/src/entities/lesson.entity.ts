import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';
import { BaseEntity } from './BaseEntity';

@Entity('lesson')
export class LessonEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  new_content: string;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ type: 'int', nullable: false })
  course_id: number;

  @ManyToOne(() => CourseEntity, (course) => course.lessons)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column({ type: 'int', nullable: false })
  created_by: number;

  @ManyToOne(() => UserEntity, (user) => user.created_by_lessons)
  @JoinColumn({ name: 'created_by' })
  created_by_user: UserEntity;

  @Column({ type: 'int', nullable: true })
  approved_by: number;

  @ManyToOne(() => UserEntity, (user) => user.approved_by_lessons)
  @JoinColumn({ name: 'approved_by' })
  approved_by_user: UserEntity;

  @Column({ type: 'int', nullable: true })
  archive_by: number;

  @ManyToOne(() => UserEntity, (user) => user.archive_by_lessons)
  @JoinColumn({ name: 'archive_by' })
  archive_by_user: UserEntity;
}
