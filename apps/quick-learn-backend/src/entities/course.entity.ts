import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { CourseCategoryEntity } from './course-category.entity';
import { RoadmapEntity } from './roadmap.entity';
import { BaseEntity } from './BaseEntity';

@Entity('course')
export class CourseEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 5000 })
  description: string;

  @Column({ type: 'int', nullable: false })
  course_category_id: number;

  @Column({ type: 'boolean', default: false })
  acheived: boolean;

  @ManyToOne(
    () => CourseCategoryEntity,
    (courseCategory) => courseCategory.courses,
  )
  @JoinColumn({ name: 'course_category_id' })
  category: CourseCategoryEntity;

  @ManyToMany(() => RoadmapEntity, (roadmap) => roadmap.courses)
  roadmaps: RoadmapEntity[];
}
