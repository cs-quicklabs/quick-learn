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
      <head>
        <meta
          name="title"
          content="Quick Learn - Bite-Sized Learning for Daily Growth"
        />
        <meta
          name="description"
          content="Quick Learn is a simple and efficient learning management system designed for bite-sized lessons. Get 2-minute daily learning nuggets, improve retention, and build a habit of continuous learning."
        />
        <meta
          name="keywords"
          content="Quick Learn, bite-sized learning, microlearning, daily lessons, Quick Recruit, online learning, knowledge base, employee onboarding, LMS, quick lessons, markdown editor, learning nuggets"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Quick Learn Team" />
        <meta
          property="og:title"
          content="Quick Learn - Bite-Sized Learning for Daily Growth"
        />
        <meta
          property="og:description"
          content="Quick Learn is a microlearning platform that delivers daily short lessons to enhance knowledge retention. Ideal for individuals and teams."
        />
        <meta
          property="og:image"
          content="https://learn.quicklabs.in/quicklearn-preview"
        />
        <meta property="og:url" content="https://learn.quicklabs.in/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Quick Learn - Bite-Sized Learning for Daily Growth"
        />
        <meta
          name="twitter:description"
          content="Get daily bite-sized lessons with Quick Learn, a lightweight learning management system designed for efficiency and consistency."
        />
        <meta
          name="twitter:image"
          content="https://learn.quicklabs.in/quicklearn-preview.png"
        />
      </head>
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
