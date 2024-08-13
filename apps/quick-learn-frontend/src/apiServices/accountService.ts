import { accountApiEnum } from '@src/constants/api.enum';
import axiosInstance from './axios';
import { AxiosSuccessResponse } from './axios';
import {
  TSkill,
  TRoadmapCategories,
  TCourseCategories,
  TRoadmapCategory,
  TCourseCategory,
  TSkills,
  TTeam,
} from '@src/shared/types/accountTypes';

// export const getUserProfile = async (): Promise<
//   AxiosSuccessResponse<TUserProfileType>
// > => {
//   const response = await axiosInstance.get<
//     AxiosSuccessResponse<TUserProfileType>
//   >(userApiEnum.GET_USER_PROFILE);
//   return response.data;
// };
{
  [];
}

export const addSkill = async (data: TSkill): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<{}>>(
    accountApiEnum.SKILLS,
    data,
  );
  return response.data;
};

export const getSkills = async (): Promise<AxiosSuccessResponse<TSkills>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TSkills>>(
    accountApiEnum.SKILLS,
  );
  return response.data;
};

export const addRoadmapCategory = async (
  data: TRoadmapCategories,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<{}>>(
    accountApiEnum.ROADMAP_CATEGORIES,
    data,
  );
  return response.data;
};

export const getRoadmapCategories = async (): Promise<
  AxiosSuccessResponse<TRoadmapCategory>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TRoadmapCategory>
  >(accountApiEnum.ROADMAP_CATEGORIES);
  return response.data;
};

export const addCourseCategory = async (
  data: TCourseCategories,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<{}>>(
    accountApiEnum.COURSE_CATEGORIES,
    data,
  );
  return response.data;
};

export const getCourseCategories = async (): Promise<
  AxiosSuccessResponse<TCourseCategory>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TCourseCategory>
  >(accountApiEnum.COURSE_CATEGORIES);
  return response.data;
};

export const getTeamDetails = async (): Promise<
  AxiosSuccessResponse<TTeam>
> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TTeam>>(
    accountApiEnum.TEAM,
  );
  return response.data;
};
