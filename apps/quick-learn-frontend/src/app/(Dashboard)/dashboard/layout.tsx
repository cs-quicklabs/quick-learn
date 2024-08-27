import { UserProvider } from '@src/context/userContext';
import Navbar from '@src/shared/components/Navbar';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="min-h-screen max-w-screen">
        <Navbar />
        <main className="max-w-screen-2xl mx-auto py-3 px-4 sm:py-5 lg:px-8">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
