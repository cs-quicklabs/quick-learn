'use client';
import 'flowbite/dist/flowbite.css';
import './global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReduxProvider } from '@src/store/provider';

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ReduxProvider>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            pauseOnFocusLoss={false}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
