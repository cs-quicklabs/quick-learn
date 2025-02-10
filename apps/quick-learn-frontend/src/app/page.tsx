import React from 'react';
import { Metadata } from 'next';
import AuthTemplate from '@src/shared/pageTemplates/AuthTemplate';
import Login from './(Auth)/login/Login';

export const metadata: Metadata = {
  title: 'Quick Learn',
  description: 'Quick Learn from Crownstack',
};
function LoginPage() {
  return (
    <AuthTemplate title="Sign in to your account">
      <Login />
    </AuthTemplate>
  );
}

export default LoginPage;
