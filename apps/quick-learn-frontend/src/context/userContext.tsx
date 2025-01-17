'use client';
import { getUser } from '@src/apiServices/authService';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { TUser } from '@src/shared/types/userTypes';
import { updateContentRepository } from '@src/store/features/metadataSlice';
import { useAppDispatch } from '@src/store/hooks';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { UserTypeIdEnum } from 'lib/shared/src';
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
        if (res.data.user_type_id != UserTypeIdEnum.MEMBER) {
          fetchContentRepositoryMetadata();
        }
      })
      .catch((err) => showApiErrorInToast(err));
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
