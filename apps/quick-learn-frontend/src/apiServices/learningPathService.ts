import {
  TLesson,
  TUserCourse,
  TRoadmap,
} from '@src/shared/types/contentRepository';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { LearningPathAPIEnum } from '@src/constants/api.enum';
import { SearchedQuery } from '@src/shared/types/contentRepository';

export const getLearningPathRoadmap = async (
  id: string,
  userId?: number,
): Promise<AxiosSuccessResponse<TRoadmap>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TRoadmap>>(
    LearningPathAPIEnum.GET_LEARNING_PATH_ROADMAP.replace(':id', id) +
      `${userId ? `/${userId}` : ''}`,
  );
  return response.data;
};

export const getLearningPathCourse = async (
  id: string,
  userId?: number,
  roadmapId?: string,
): Promise<AxiosSuccessResponse<TUserCourse>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TUserCourse>>(
    LearningPathAPIEnum.GET_LEARNING_PATH_COURSE.replace(':id', id) +
      `${userId ? `/${userId}` : ''}` +
      (roadmapId ? `?roadmapId=${roadmapId}` : ''),
  );
  return response.data;
};

export const getLearningPathLessionDetails = async (
  id: string,
  courseId: string,
  userId?: number,
  roadmapId?: string,
): Promise<AxiosSuccessResponse<TLesson>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TLesson>>(
    LearningPathAPIEnum.GET_LEARNING_PATH_LESSON.replace(':id', id) +
      `${userId ? `/${userId}` : ''}` +
      `?courseId=${courseId}` +
      (roadmapId ? `&roadmapId=${roadmapId}` : ''),
  );
  return response.data;
};

export const getSearchQuery = async (
  query: string,
): Promise<AxiosSuccessResponse<SearchedQuery>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<SearchedQuery>>(
    LearningPathAPIEnum.GET_USER_SEARCH + `?query=${query}`,
  );
  return response.data;
};
