import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { TeamEntity } from './team.entity';
import { CourseCategoryEntity } from './course_category.entity';

@Entity({ name: 'roadmap_categories' })
export class RoadmapCategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column()
  team_id: number;

  @ManyToOne(() => TeamEntity, (team) => team.roadmap_categories)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @OneToMany(() => CourseCategoryEntity, (roadmap) => roadmap.course)
  roadmaps: CourseCategoryEntity[];
}
