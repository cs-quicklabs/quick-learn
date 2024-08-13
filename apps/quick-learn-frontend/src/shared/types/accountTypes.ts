export type TSkill = {
  name: string;
  team_id: number;
};

export type TRoadmapCategories = {
  name: string;
  team_id: number;
};

export type TCourseCategories = {
  name: string;
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
  teams: TTeams[];
};
