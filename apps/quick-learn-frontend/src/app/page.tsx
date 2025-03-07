import React from 'react';
import { Metadata } from 'next';
import AuthTemplate from '@src/shared/pageTemplates/AuthTemplate';
import Login from './(Auth)/login/Login';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn.quicklabs.in/'),
  openGraph: {
    title: 'Quick Learn',
    description: 'Quick Learn from Crownstack',
    url: 'https://learn.quicklabs.in/',
    siteName: 'Quick Learn',
    images: [
      {
        url: '/quicklearn.png',
        width: 1200,
        height: 630,
        alt: 'Quick Learn Preview',
      },
    ],
    type: 'website',
  },
};
function LoginPage() {
  return (
    <AuthTemplate title="Sign in to your account">
      <Login />
    </AuthTemplate>
  );
}

export default LoginPage;
