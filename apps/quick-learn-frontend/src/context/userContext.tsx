'use client';
import { getUser } from '@src/apiServices/authService';
import { TUser } from '@src/shared/types/userTypes';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { createContext, useState, useEffect, useMemo } from 'react';
import { useFetchContentRepositoryMetadata } from './contextHelperService';

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
  const fetchMetadata = useFetchContentRepositoryMetadata();

  useEffect(() => {
    getUser()
      .then((res) => {
        setUser(res.data);
        fetchMetadata(res.data.user_type_id);
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
