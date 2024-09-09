'use client';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import useDashboardStore from '@src/store/dashboard.store';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { setContentRepositoryMetadata } = useDashboardStore((state) => state);

  useEffect(() => {
    getContentRepositoryMetadata()
      .then((response) => setContentRepositoryMetadata(response.data))
      .catch((error) => showApiErrorInToast(error));
  }, [setContentRepositoryMetadata]);
  return <>{children}</>;
}
