import 'flowbite/dist/flowbite.css';
import './global.css';
import { ToastContainer } from 'react-toastify';
import { ReduxProvider } from '@src/store/provider';
import ClientIpWrapper from '@src/shared/components/ClientIpWrapper';

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ReduxProvider>
          <ClientIpWrapper />
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            pauseOnFocusLoss={false}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
