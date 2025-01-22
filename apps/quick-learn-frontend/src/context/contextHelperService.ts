'use client';

import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { updateContentRepository } from '@src/store/features/metadataSlice';
import { UserTypeIdEnum } from 'lib/shared/src';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@src/store/hooks';
import { RouteEnum } from '@src/constants/route.enum';

// Custom hook to fetch content repository metadata
export const useFetchContentRepositoryMetadata = () => {
  const dispatch = useAppDispatch();
  const path = usePathname();

  const fetchMetadata = async (user_type: number) => {
    if (path === RouteEnum.CONTENT || user_type === UserTypeIdEnum.MEMBER) {
      return;
    }

    try {
      const res = await getContentRepositoryMetadata();
      dispatch(updateContentRepository(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  return fetchMetadata;
};
