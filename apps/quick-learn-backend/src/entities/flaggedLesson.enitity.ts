import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';
import { UserEntity } from './user.entity';

@Entity('flagged_lessons')
@Unique(['lesson_id']) // Ensures lesson_id is unique
export class FlaggedLessonEntity extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  lesson_id: number;

  @Column({ type: 'int', nullable: false })
  course_id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => LessonEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @CreateDateColumn()
  flagged_On: Date;
}
