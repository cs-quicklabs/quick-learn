'use client';
import { getUser } from '@src/apiServices/authService';
import { TUser } from '@src/shared/types/userTypes';
import { showApiErrorInToast } from '@src/utils/toastUtils';
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

  useEffect(() => {
    getUser()
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
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
