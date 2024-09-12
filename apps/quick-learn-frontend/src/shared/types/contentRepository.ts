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

export interface TCreateCourse {
  name: string;
  description: string;
  course_category_id: string;
  is_community_available: boolean;
}

export interface TRoadmap extends TCreateRoadmap {
  id: string;
  archived: boolean;
  roadmap_category: TRoadmapCategories;
  courses: TCourse[];
  courses_count?: number;
  lessons_count?: number;
  users_count?: number;
  created_by_user_id: number;
  created_by?: TUser;
  created_at: string;
  updated_at: string;
}

export interface TCourse extends TCreateCourse {
  id: string;
  archived: boolean;
  roadmaps?: TRoadmap[];
  course_category: TCourseCategories;
  created_by_user_id: number;
  lessons_count?: number;
  users_count?: number;
  created_by?: TUser;
  created_at: string;
  updated_at: string;
}

export type TAssignModalMetadata = {
  name: string;
  list: {
    value: number;
    name: string;
  }[];
};
