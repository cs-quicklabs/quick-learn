import { Entity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { SkillEntity } from './skill.entity';
import { BaseEntity } from './BaseEntity';
import { RoadmapCategoryEntity } from './roadmap-category.entity';

@Entity({ name: 'team' })
export class TeamEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  logo: string;

  @OneToMany(() => UserEntity, (user) => user.team)
  users: UserEntity[];

  @OneToMany(() => SkillEntity, (skill) => skill.team)
  skills: SkillEntity[];

  @OneToMany(
    () => RoadmapCategoryEntity,
    (roadmap_category) => roadmap_category.team,
  )
  roadmap_categories: RoadmapCategoryEntity[];
}
