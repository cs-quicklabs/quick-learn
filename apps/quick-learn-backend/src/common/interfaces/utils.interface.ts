export interface IGlobalSearchParams {
  userId: number;
  isMember: boolean;
  query: string;
  userTeamId: number;
}

export interface IPaginationParams {
  q: string;
  page: number;
  limit: number;
  team_id: number;
}
