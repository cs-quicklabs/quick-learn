import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { RoadmapCategoryEntity } from './roadmap_category.entity';

@Entity({ name: 'course_categories' })
export class CourseCategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column()
  roadmap_id: number;

  @ManyToOne(() => RoadmapCategoryEntity, (course) => course.roadmaps)
  @JoinColumn({ name: 'roadmap_id' })
  course: RoadmapCategoryEntity;
}
