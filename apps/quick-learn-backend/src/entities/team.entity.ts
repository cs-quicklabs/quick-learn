import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { SkillEntity } from './skill.entity';
import { BaseEntity } from './BaseEntity';
import { RoadmapCategoryEntity } from './roadmap_category.entity';

@Entity({ name: 'team' })
export class TeamEntity extends BaseEntity {
  @OneToMany(() => UserEntity, (user) => user.team)
  users: UserEntity[];

  @OneToMany(() => SkillEntity, (skill) => skill.team)
  skills: SkillEntity[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @OneToMany(
    () => RoadmapCategoryEntity,
    (roadmap_category) => roadmap_category.team,
  )
  roadmap_categories: RoadmapCategoryEntity[];
}
