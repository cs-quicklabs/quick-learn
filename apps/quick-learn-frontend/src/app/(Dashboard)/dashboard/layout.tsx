'use client';
import { getUser } from '@src/apiServices/authService';
import { RouteEnum } from '@src/constants/route.enum';
import { useFetchContentRepositoryMetadata } from '@src/context/contextHelperService';
import Navbar from '@src/shared/components/Navbar';
import { TUser } from '@src/shared/types/userTypes';
import { selectHideNavbar } from '@src/store/features/uiSlice';
import { setUser } from '@src/store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Create a module-level flag for the entire session
let hasInitialFetchStarted = false;
let currentFetchPromise: Promise<TUser | void> | null = null;

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const hideNavbar = useAppSelector(selectHideNavbar);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { fetchMetadata, fetchApprovalData } =
    useFetchContentRepositoryMetadata();
  const isFetching = useRef(false);

  useEffect(() => {
    if (hasInitialFetchStarted || isFetching.current || currentFetchPromise) {
      return;
    }

    isFetching.current = true;

    currentFetchPromise = getUser()
      .then((res) => {
        if (!hasInitialFetchStarted) {
          hasInitialFetchStarted = true;
          dispatch(setUser(res.data));

          return fetchMetadata(res?.data.user_type_id).then(() => {
            fetchApprovalData(res?.data.user_type_id);
            return res.data;
          });
        }
        return res.data;
      })
      .catch((err) => {
        hasInitialFetchStarted = false;
        currentFetchPromise = null;
        console.log(err);
      })
      .finally(() => {
        isFetching.current = false;
      });
  }, [dispatch, fetchMetadata, fetchApprovalData]);

  const fullWidthPaths = [RouteEnum.MY_LEARNING_PATH];
  const isFullWidth = fullWidthPaths.some((path) => pathname?.startsWith(path));
  const mainClasses = isFullWidth
    ? 'mt-16 w-full'
    : 'max-w-screen-2xl mx-auto mt-16 py-3 px-4 sm:py-5 lg:px-8';

  return (
    <div className="w-full">
      {!hideNavbar && <Navbar />}
      <main className={mainClasses}>{children}</main>
    </div>
  );
}
