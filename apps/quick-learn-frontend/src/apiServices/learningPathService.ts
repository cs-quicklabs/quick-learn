import {
  TLesson,
  TUserCourse,
  TUserRoadmap,
} from '@src/shared/types/contentRepository';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { LearningPathAPIEnum } from '@src/constants/api.enum';

export const getLearningPathRoadmap = async (
  id: string,
): Promise<AxiosSuccessResponse<TUserRoadmap>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TUserRoadmap>>(
    LearningPathAPIEnum.GET_LEARNING_PATH_ROADMAP.replace(':id', id),
  );
  return response.data;
};

export const getLearningPathCourse = async (
  id: string,
  roadmapId?: string,
): Promise<AxiosSuccessResponse<TUserCourse>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TUserCourse>>(
    LearningPathAPIEnum.GET_LEARNING_PATH_COURSE.replace(':id', id) +
      (roadmapId ? `?roadmapId=${roadmapId}` : ''),
  );
  return response.data;
};

export const getLearningPathLessionDetails = async (
  id: string,
  courseId: string,
  roadmapId?: string,
): Promise<AxiosSuccessResponse<TLesson>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TLesson>>(
    LearningPathAPIEnum.GET_LEARNING_PATH_LESSON.replace(':id', id) +
      `?courseId=${courseId}` +
      (roadmapId ? `&roadmapId=${roadmapId}` : ''),
  );
  return response.data;
};
