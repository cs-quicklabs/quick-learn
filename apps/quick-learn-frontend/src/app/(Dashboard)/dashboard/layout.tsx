'use client';
import { UserProvider } from '@src/context/userContext';
import Navbar from '@src/shared/components/Navbar';
import { selectHideNavbar } from '@src/store/features/uiSlice';
import { useAppSelector } from '@src/store/hooks';
import { usePathname } from 'next/navigation';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const hideNavbar = useAppSelector(selectHideNavbar);
  const pathname = usePathname();

  // Add paths that should be full width
  const fullWidthPaths = ['/dashboard/learning-path'];

  const isFullWidth = fullWidthPaths.some((path) => pathname?.startsWith(path));

  const mainClasses = isFullWidth
    ? 'mt-16 w-full'
    : 'max-w-screen-2xl mx-auto mt-16 py-3 px-4 sm:py-5 lg:px-8';

  return (
    <UserProvider>
      <div className="w-full">
        {!hideNavbar && <Navbar />}
        <main className={mainClasses}>{children}</main>
      </div>
    </UserProvider>
  );
}
