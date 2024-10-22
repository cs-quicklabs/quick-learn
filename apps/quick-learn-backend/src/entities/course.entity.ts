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

  @Column({ type: 'int', nullable: false })
  created_by_user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.roadmaps)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: UserEntity;

  @ManyToOne(
    () => CourseCategoryEntity,
    (courseCategory) => courseCategory.courses,
  )
  @JoinColumn({ name: 'course_category_id' })
  course_category: CourseCategoryEntity;

  @ManyToMany(() => RoadmapEntity, (roadmap) => roadmap.courses)
  roadmaps: RoadmapEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.course)
  lessons: LessonEntity[];
}
