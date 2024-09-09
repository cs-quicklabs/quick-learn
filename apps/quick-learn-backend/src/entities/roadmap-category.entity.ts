import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { TeamEntity } from './team.entity';
import { RoadmapEntity } from './roadmap.entity';

@Entity({ name: 'roadmap_category' })
export class RoadmapCategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'int', nullable: false })
  team_id: number;

  @ManyToOne(() => TeamEntity, (team) => team.roadmap_categories)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @OneToMany(() => RoadmapEntity, (roadmap) => roadmap.roadmap_category)
  roadmaps: RoadmapEntity[];
}
