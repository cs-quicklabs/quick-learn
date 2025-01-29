'use client';
import { getUser } from '@src/apiServices/authService';
import { RouteEnum } from '@src/constants/route.enum';
import { useFetchContentRepositoryMetadata } from '@src/context/contextHelperService';
import Navbar from '@src/shared/components/Navbar';
import { selectHideNavbar } from '@src/store/features/uiSlice';
import { setUser } from '@src/store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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

  useEffect(() => {
    const fetchData = async () => {
      getUser()
        .then((res) => {
          dispatch(setUser(res.data));
          fetchMetadata(res?.data.user_type_id);
          fetchApprovalData(res?.data.user_type_id);
        })
        .catch((err) => console.log(err));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add paths that should be full width
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
