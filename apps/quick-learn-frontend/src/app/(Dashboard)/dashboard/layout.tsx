'use client';
import { UserProvider } from '@src/context/userContext';
import Navbar from '@src/shared/components/Navbar';
import { fetchRoadmaps } from '@src/store/features/roadmapsSlice';
import { selectHideNavbar } from '@src/store/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const hideNavbar = useAppSelector(selectHideNavbar);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Add paths that should be full width
  const fullWidthPaths = ['/dashboard/learning-path'];

  const isFullWidth = fullWidthPaths.some((path) => pathname?.startsWith(path));

  const mainClasses = isFullWidth
    ? 'mt-16 w-full'
    : 'max-w-screen-2xl mx-auto mt-16 py-3 px-4 sm:py-5 lg:px-8';

  useEffect(() => {
    dispatch(fetchRoadmaps());
  }, [dispatch]);
  return (
    <UserProvider>
      <div className="w-full">
        {!hideNavbar && <Navbar />}
        <main className={mainClasses}>{children}</main>
      </div>
    </UserProvider>
  );
}
