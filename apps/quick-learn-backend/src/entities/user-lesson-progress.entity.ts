import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LessonEntity } from './lesson.entity';
import { CourseEntity } from './course.entity';
import { TeamEntity } from './team.entity';

@Entity('user_lesson_progress')
export class UserLessonProgressEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  lesson_id: number;

  @Column({ type: 'int', nullable: false })
  course_id: number;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_date' })
  completed_date: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => LessonEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @OneToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
