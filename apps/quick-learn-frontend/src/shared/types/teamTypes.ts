import { TUser, TUserMetadata } from './userTypes';
import { IResponse } from '../interfaces/responseInterface';

type TList = {
  items: TUser[];
  limit: number;
  page: number;
  total: number;
  total_pages: number;
};

export type TAddUserPayload = {
  first_name: string;
  last_name: string;
  user_type_id: string;
  email: string;
  password: string;
  confirm_password: string;
  skill_id: string;
  team_id: number | undefined;
};

export type TTeamListingReponse = IResponse<TList>;
export type TUserMetadataResponse = IResponse<TUserMetadata>;
export type TUserDetailsResponse = IResponse<TUser>;
export type TAddUserResponse = IResponse<unknown>;
