'use client';

import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { updateContentRepository } from '@src/store/features/metadataSlice';
import { UserTypeIdEnum } from 'lib/shared/src';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@src/store/hooks';
import { RouteEnum } from '@src/constants/route.enum';
import { showApiErrorInToast } from '@src/utils/toastUtils';

// Custom hook to fetch content repository metadata
// This will fetch data for the user other than member or when it is forced
// to fetch the metadata
export const useFetchContentRepositoryMetadata = (forceFetch = false) => {
  const dispatch = useAppDispatch();
  const path = usePathname();

  const fetchMetadata = async (user_type = UserTypeIdEnum.MEMBER) => {
    if (
      !forceFetch &&
      (path === RouteEnum.CONTENT || user_type === UserTypeIdEnum.MEMBER)
    ) {
      return;
    }

    getContentRepositoryMetadata()
      .then((res) => {
        dispatch(updateContentRepository(res.data));
      })
      .catch((err) => showApiErrorInToast(err));
  };
  return fetchMetadata;
};
