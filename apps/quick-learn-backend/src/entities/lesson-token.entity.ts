import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { DailyLessonEnum } from '@src/common/enum/daily_lesson.enum';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';
import { UserEntity } from './user.entity';
import { FlaggedLessonEntity } from './flagged-lesson.enitity';
import { TeamEntity } from './team.entity';

@Entity('lesson_token')
export class LessonTokenEntity extends BaseEntity {
  @Column()
  token: string;

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

  @Column({
    type: 'varchar',
    nullable: false,
    default: DailyLessonEnum.PENDING,
  })
  status: string;

  @OneToOne(() => FlaggedLessonEntity, (flagged) => flagged.lesson)
  flagged_lesson: FlaggedLessonEntity;

  @Column()
  expires_at: Date;

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @OneToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
