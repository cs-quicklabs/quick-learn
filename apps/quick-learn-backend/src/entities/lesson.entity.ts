import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';
import { BaseEntity } from './BaseEntity';
import { UserLessonProgressEntity } from './user-lesson-progress.entity';
import { FlaggedLessonEntity } from './flagged-lesson.enitity';
import { TeamEntity } from './team.entity';

@Entity('lesson')
export class LessonEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 80 })
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

  @ManyToOne(() => CourseEntity, (course) => course.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @ManyToOne(() => UserEntity, (user) => user.created_by_lessons, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  created_by_user: UserEntity;

  @Column({ type: 'int', nullable: true })
  approved_by: number;

  @ManyToOne(() => UserEntity, (user) => user.approved_by_lessons, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'approved_by' })
  approved_by_user: UserEntity;

  @Column({ type: 'int', nullable: true })
  archive_by: number;

  @ManyToOne(() => UserEntity, (user) => user.archive_by_lessons, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'archive_by' })
  archive_by_user: UserEntity;

  @OneToMany(() => UserLessonProgressEntity, (progress) => progress.lesson)
  users_lesson_progress: UserLessonProgressEntity[];

  @OneToOne(() => FlaggedLessonEntity, (flagged) => flagged.lesson)
  flagged_lesson: FlaggedLessonEntity;

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @ManyToOne(() => TeamEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
