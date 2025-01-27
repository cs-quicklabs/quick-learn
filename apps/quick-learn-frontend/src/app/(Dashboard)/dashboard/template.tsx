'use client';

import { fetchUser, selectUser } from '@src/store/features/userSlice';
import { fetchUnapprovedLessons } from '@src/store/features/approvalSlice';
import { useAppDispatch } from '@src/store/hooks';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Template({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
      console.log('user is calling');
    }
    // dispatch(fetchUnapprovedLessons());
  }, []);

  return <>{children}</>;
}
