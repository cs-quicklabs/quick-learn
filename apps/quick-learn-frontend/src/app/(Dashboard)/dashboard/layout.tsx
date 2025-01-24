'use client';
import { RouteEnum } from '@src/constants/route.enum';
import { UserContext, UserProvider } from '@src/context/userContext';
import Navbar from '@src/shared/components/Navbar';
import { fetchUnapprovedLessons } from '@src/store/features/approvalSlice';
import { selectHideNavbar } from '@src/store/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const hideNavbar = useAppSelector(selectHideNavbar);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useContext(UserContext);

  // Add paths that should be full width
  const fullWidthPaths = [RouteEnum.MY_LEARNING_PATH];

  const isFullWidth = fullWidthPaths.some((path) => pathname?.startsWith(path));

  const mainClasses = isFullWidth
    ? 'mt-16 w-full'
    : 'max-w-screen-2xl mx-auto mt-16 py-3 px-4 sm:py-5 lg:px-8';

  useEffect(() => {
    console.log(user);
    dispatch(fetchUnapprovedLessons());
  }, [dispatch]);
  return (
    <div className="w-full">
      {!hideNavbar && <Navbar />}
      <main className={mainClasses}>{children}</main>
    </div>
  );
}
