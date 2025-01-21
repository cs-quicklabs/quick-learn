'use client';
import { getUser } from '@src/apiServices/authService';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { TUser } from '@src/shared/types/userTypes';
import { updateContentRepository } from '@src/store/features/metadataSlice';
import { useAppDispatch } from '@src/store/hooks';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { UserTypeIdEnum } from 'lib/shared/src';
import { usePathname } from 'next/navigation';
import { createContext, useState, useEffect, useMemo } from 'react';

export const UserContext = createContext<{
  user: TUser | null;
  setUser: (user: TUser | null) => void;
}>({
  user: null,
  setUser: (user: TUser | null) => {
    return user;
  },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const path = usePathname();
  const dispatch = useAppDispatch();

  const fetchContentRepositoryMetadata = async () => {
    try {
      const res = await getContentRepositoryMetadata();
      dispatch(updateContentRepository(res.data)); //update redux store metadata
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser()
      .then((res) => {
        setUser(res.data);
        console.log(path);

        if (
          path !== '/dashboard/content' &&
          res.data.user_type_id != UserTypeIdEnum.MEMBER
        ) {
          fetchContentRepositoryMetadata();
        }
      })
      .catch((err) => showApiErrorInToast(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
