'use client';

import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { updateContentRepository } from '@src/store/features/metadataSlice';
import { UserTypeIdEnum } from 'lib/shared/src';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@src/store/hooks';
import { RouteEnum } from '@src/constants/route.enum';
import { fetchSystemPreferences } from '@src/store/features/systemPreferenceSlice';

// Custom hook to fetch content repository metadata
export const useFetchContentRepositoryMetadata = (forceFetch = false) => {
  const dispatch = useAppDispatch();
  const path = usePathname();

  const fetchMetadata = async (user_type: number) => {
    if (
      forceFetch ||
      (path !== RouteEnum.CONTENT && user_type !== UserTypeIdEnum.MEMBER)
    ) {
      try {
        const res = await getContentRepositoryMetadata();
        dispatch(updateContentRepository(res.data));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchApprovalData = (user_type: number) => {
    if (![UserTypeIdEnum.EDITOR, UserTypeIdEnum.MEMBER].includes(user_type)) {
      dispatch(fetchSystemPreferences());
    }
  };

  return { fetchMetadata, fetchApprovalData };
};
