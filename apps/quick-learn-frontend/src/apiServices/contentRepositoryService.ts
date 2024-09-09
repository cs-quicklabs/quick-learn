import {
  TContentRepositoryMetadata,
  TCreateRoadmap,
  TRoadmap,
} from '@src/shared/types/contentRepository';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ContentRepositoryApiEnum } from '@src/constants/api.enum';

export const getContentRepositoryMetadata = async (): Promise<
  AxiosSuccessResponse<TContentRepositoryMetadata>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TContentRepositoryMetadata>
  >(ContentRepositoryApiEnum.METADATA);
  return response.data;
};

export const getRoadmaps = async (): Promise<
  AxiosSuccessResponse<TRoadmap[]>
> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TRoadmap[]>>(
    ContentRepositoryApiEnum.ROADMAP,
  );
  return response.data;
};

export const getRoadmap = async (
  id: string,
): Promise<AxiosSuccessResponse<TRoadmap>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TRoadmap>>(
    ContentRepositoryApiEnum.ROADMAP + `/${id}`,
  );
  return response.data;
};

export const createRoadmap = async (
  data: TCreateRoadmap,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.ROADMAP,
    data,
  );
  return response.data;
};

export const updateRoadmap = async (
  id: string,
  data: TCreateRoadmap,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.ROADMAP + `/${id}`,
    data,
  );
  return response.data;
};
