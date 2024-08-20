import { UserProvider } from '@src/context/userContext';
import Navbar from '@src/shared/components/Navbar';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <Navbar />
      <main className="mx-auto py-3 sm:py-5 min-h-screen px-4 max-w-screen-2xl lg:px-8">
        {children}
      </main>
    </UserProvider>
  );
}
