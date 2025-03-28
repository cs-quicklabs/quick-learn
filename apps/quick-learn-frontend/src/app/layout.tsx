import './global.css';
import { ToastContainer } from 'react-toastify';
import { ReduxProvider } from '@src/store/provider';
import ClientIpWrapper from '@src/shared/components/ClientIpWrapper';
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata, Viewport } from 'next';

// Initialize the Inter font with subset optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

// Export separate viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
};

// Metadata configuration
export const metadata: Metadata = {
  title: 'Quick Learn - Bite-Sized Learning for Daily Growth',
  description:
    'Quick Learn is a simple and efficient learning management system designed for bite-sized lessons. Get 2-minute daily learning nuggets, improve retention, and build a habit of continuous learning.',
  keywords:
    'Quick Learn, bite-sized learning, microlearning, daily lessons, Quick Recruit, online learning, knowledge base, employee onboarding, LMS, quick lessons, markdown editor, learning nuggets',
  metadataBase: new URL('https://learn.quicklabs.in'),
  openGraph: {
    title: 'Quick Learn - Bite-Sized Learning for Daily Growth',
    description:
      'Quick Learn is a microlearning platform that delivers daily short lessons to enhance knowledge retention. Ideal for individuals and teams.',
    images: [
      {
        url: 'https://learn.quicklabs.in/quicklearn-preview.png',
        width: 1200,
        height: 630,
        alt: 'Quick Learn - Bite-Sized Learning for Daily Growth',
      },
    ],
    url: 'https://learn.quicklabs.in/',
    type: 'website',
    siteName: 'Quick Learn',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quick Learn - Bite-Sized Learning for Daily Growth',
    description:
      'Get daily bite-sized lessons with Quick Learn, a lightweight learning management system designed for efficiency and consistency.',
    images: [
      {
        url: 'https://learn.quicklabs.in/quicklearn-preview.png',
        alt: 'Quick Learn - Bite-Sized Learning for Daily Growth',
      },
    ],
    creator: '@quicklearn',
    site: '@quicklearn',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  authors: [{ name: 'Quick Learn Team', url: 'https://quicklabs.in' }],
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
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
