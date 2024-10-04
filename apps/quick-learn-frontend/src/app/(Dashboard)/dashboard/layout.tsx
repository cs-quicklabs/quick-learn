'use client';
import { UserProvider } from '@src/context/userContext';
import useDashboardStore from '@src/store/dashboard.store';
import Navbar from '@src/shared/components/Navbar';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { hideNavbar } = useDashboardStore((state) => state);
  return (
    <UserProvider>
      <div className="max-w-screen">
        {!hideNavbar && <Navbar />}
        <main className="max-w-screen-2xl mx-auto mt-16 py-3 px-4 sm:py-5 lg:px-8">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
