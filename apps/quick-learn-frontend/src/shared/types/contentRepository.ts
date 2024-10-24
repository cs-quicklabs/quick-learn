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
  updated_by?: TUser;
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
  lessons?: TLesson[];
  updated_by?: TUser;
}

export type TAssignModalMetadata = {
  name: string;
  list: {
    value: number;
    name: string;
  }[];
};

export type TLesson = {
  id: number;
  name: string;
  content: string;
  new_content: string;
  approved: string;
  archived: boolean;
  created_by: number;
  created_by_user: TUser;
  approved_by: number;
  approved_by_user: TUser;
  archive_by: number;
  archive_by_user: TUser;
  created_at: string;
  updated_at: string;
  course_id: number;
  course: TCourse;
};
