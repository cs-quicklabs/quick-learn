import { TLesson } from '@src/shared/types/contentRepository';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ContentRepositoryApiEnum } from '@src/constants/api.enum';
import {
  LessonProgress,
  LessonStatus,
  UserLessonProgress,
} from '@src/shared/types/LessonProgressTypes';

export const getArchivedLessons = async (): Promise<
  AxiosSuccessResponse<TLesson[]>
> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TLesson[]>>(
    ContentRepositoryApiEnum.LESSON_ARCHIVED,
  );
  return response.data;
};

export const getUnapprovedLessons = async (): Promise<
  AxiosSuccessResponse<TLesson[]>
> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TLesson[]>>(
    ContentRepositoryApiEnum.LESSON_UNAPPROVED,
  );
  return response.data;
};

export const getLessonDetails = async (
  id: string,
  approved = true,
): Promise<AxiosSuccessResponse<TLesson>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TLesson>>(
    ContentRepositoryApiEnum.LESSON + `/${id}` + `?approved=${approved}`,
  );
  return response.data;
};

export const approveLesson = async (
  id: string,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.LESSON + `/${id}/approve`,
  );
  return response.data;
};

export const updateLesson = async (
  id: string,
  data: Partial<TLesson>,
): Promise<AxiosSuccessResponse<TLesson>> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse<TLesson>>(
    ContentRepositoryApiEnum.LESSON + `/${id}`,
    data,
  );
  return response.data;
};

// this api mark lesson as read.
export const markAsDone = async (
  lessonId: string,
  courseId: string,
  isCompleted: boolean,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    `${ContentRepositoryApiEnum.LESSON_PROGRESS}/complete/${lessonId}`,
    {
      courseId: parseInt(courseId),
      isCompleted: isCompleted,
    },
  );
  return response.data;
};

//this api returns read lesson array
export const getCourseProgress = async (
  courseId: string,
): Promise<AxiosSuccessResponse<LessonProgress[]>> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<LessonProgress[]>
  >(`${ContentRepositoryApiEnum.LESSON_PROGRESS}/${courseId}/progress`);
  return response.data;
};

export const getLessonStatus = async (
  LessonId: string,
): Promise<AxiosSuccessResponse<LessonStatus>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<LessonStatus>>(
    `${ContentRepositoryApiEnum.LESSON_PROGRESS}/check/${LessonId}`,
  );
  return response.data;
};

export const getUserProgress = async (): Promise<
  AxiosSuccessResponse<UserLessonProgress[]>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<UserLessonProgress[]>
  >(`${ContentRepositoryApiEnum.LESSON_PROGRESS}/userprogress`);
  return response.data;
};
