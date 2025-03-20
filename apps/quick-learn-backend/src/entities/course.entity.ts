import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CourseCategoryEntity } from './course-category.entity';
import { RoadmapEntity } from './roadmap.entity';
import { BaseEntity } from './BaseEntity';
import { UserEntity } from './user.entity';
import { LessonEntity } from './lesson.entity';
import { TeamEntity } from './team.entity';

@Entity('course')
export class CourseEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 5000 })
  description: string;

  @Column({ type: 'int', nullable: false })
  course_category_id: number;

  @Column({ type: 'bool', default: false })
  archived: boolean;

  @Column({ type: 'bool', default: false })
  is_community_available: boolean;

  @Column({ type: 'int', nullable: true })
  created_by_user_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @ManyToOne(() => UserEntity, (user) => user.updated_courses, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.roadmaps, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: UserEntity;

  @ManyToOne(
    () => CourseCategoryEntity,
    (courseCategory) => courseCategory.courses,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'course_category_id' })
  course_category: CourseCategoryEntity;

  @ManyToMany(() => RoadmapEntity, (roadmap) => roadmap.courses, {
    onDelete: 'CASCADE',
  })
  roadmaps: RoadmapEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.course, {
    cascade: true,
  })
  lessons: LessonEntity[];

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
