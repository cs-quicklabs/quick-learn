'use client';
import 'flowbite/dist/flowbite.css';
import './global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReduxProvider } from '@src/store/provider';
import { useEffect } from 'react';
import { useAppDispatch } from '@src/store/hooks';
import { fetchMetadata } from '@src/store/features/metadataSlice';

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMetadata());
  }, [dispatch]);

  return children;
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ReduxProvider>
          <RootLayoutContent>
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={true}
              pauseOnFocusLoss={false}
            />
            {children}
          </RootLayoutContent>
        </ReduxProvider>
      </body>
    </html>
  );
}
