import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'course_categories' })
export class CourseCategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;
}
