export type TUserType = {
  id?: number;
  code: string;
  name: string;
  description?: string;
};

export type TSkill = {
  name: string;
  team_id: number;
};

export type TUser = {
  uuid: string;
  display_name: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  active: boolean;
  user_type_id: number;
  user_type: TUserType;
  skill_id: number;
  skill: TSkill;
  last_login_timestamp: string;
  created_at: string;
};
