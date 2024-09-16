import { TCourse, TRoadmap } from './contentRepository';

export type TSkill = {
  id: number;
  name: string;
  team_id: number;
};

export type TRoadmapCategories = {
  id: number;
  name: string;
  team_id: number;
  roadmaps: TRoadmap[];
};

export type TCourseCategories = {
  id: number;
  name: string;
  team_id: number;
  courses: TCourse[];
};

export type TSkills = {
  skills: TSkill[];
};

export type TRoadmapCategory = {
  categories: TRoadmapCategories[];
};

export type TCourseCategory = {
  categories: TCourseCategories[];
};

export type TTeams = {
  name: string;
};

export type TTeam = {
  name: string;
  logo: string | File;
};
