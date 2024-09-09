import { TCourseCategories, TRoadmapCategories } from './accountTypes';
import { TUser } from './userTypes';

export interface TContentRepositoryMetadata {
  roadmap_categories: TRoadmapCategories[];
  course_categories: TCourseCategories[];
}

export interface TCreateRoadmap {
  name: string;
  description: string;
  roadmap_category_id: string;
}

export interface TRoadmap extends TCreateRoadmap {
  id: string;
  archived: boolean;
  roadmap_category: TRoadmapCategories;
  courses: TCourseCategories[];
  courses_count?: number;
  lessons_count?: number;
  users_count?: number;
  created_by_user_id: number;
  created_by?: TUser;
  created_at: string;
  updated_at: string;
}
