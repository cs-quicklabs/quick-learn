'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMetadata,
  selectIsMetadataInitialized,
} from '@src/store/features/metadataSlice';
import { AppDispatch } from '@src/store/store';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector(selectIsMetadataInitialized);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchMetadata());
    }
  }, [dispatch, isInitialized]);

  return <>{children}</>;
}
