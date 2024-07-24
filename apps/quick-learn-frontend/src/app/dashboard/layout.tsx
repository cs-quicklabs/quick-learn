import Navbar from '../../shared/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 lg:py-6">
        {children}
      </main>
    </>
  );
}
