import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RoadmapCategoryEntity } from './roadmap-category.entity';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';

@Entity('roadmap')
export class RoadmapEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 5000 })
  description: string;

  @Column({ type: 'int', nullable: false })
  roadmap_category_id: number;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ type: 'int', nullable: false })
  created_by_user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.roadmaps)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: UserEntity;

  @ManyToOne(
    () => RoadmapCategoryEntity,
    (roadmapCategory) => roadmapCategory.roadmaps,
  )
  @JoinColumn({ name: 'roadmap_category_id' })
  roadmap_category: RoadmapCategoryEntity;

  @ManyToMany(() => CourseEntity, (course) => course.roadmaps, {
    cascade: true,
  })
  @JoinTable({
    name: 'roadmap_courses',
    joinColumn: {
      name: 'roadmap_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'course_id',
      referencedColumnName: 'id',
    },
  })
  courses: CourseEntity[];

  @ManyToMany(() => UserEntity, (user) => user.assigned_roadmaps)
  users: UserEntity[];
}
