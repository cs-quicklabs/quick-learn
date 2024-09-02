import { AxiosSuccessResponse } from '@src/apiServices/axios';
import { TUser, TUserMetadata } from './userTypes';

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

export type TTeamListingReponse = AxiosSuccessResponse<TList>;
export type TUserMetadataResponse = AxiosSuccessResponse<TUserMetadata>;
export type TUserDetailsResponse = AxiosSuccessResponse<TUser>;
export type TAddUserResponse = AxiosSuccessResponse<unknown>;
