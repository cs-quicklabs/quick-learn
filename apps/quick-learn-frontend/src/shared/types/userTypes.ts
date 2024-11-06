import { TRoadmap } from './contentRepository';

export type TUserType = {
  id?: number;
  code: string;
  name: string;
  description?: string;
};

export type TSkill = {
  name: string;
  team_id: number;
  id: number;
};

export type TUser = {
  uuid: string;
  full_name: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  active: boolean;
  user_type_id: number;
  user_type: TUserType;
  skill_id: number;
  skill: TSkill;
  team_id: number;
  team: {
    id: number;
    name: string;
  };
  last_login_timestamp: string;
  created_at: string;
  profile_image: string;
  assigned_roadmaps?: TRoadmap[];
  updated_at: string;
  updated_by: TUser;
  updated_by_id: number;
};

export type TUserMetadata = {
  user_types: TUserType[];
  skills: TSkill[];
};
