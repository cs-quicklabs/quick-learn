import React from 'react';
import { Metadata } from 'next';
import AuthTemplate from '@src/shared/pageTemplates/AuthTemplate';
import Login from './(Auth)/login/Login';

export const metadata: Metadata = {
  title: 'Login • Quick Learn',
  description:
    'Quick Learn is a simple and efficient learning management system designed for bite-sized lessons. Get 2-minute daily learning nuggets, improve retention, and build a habit of continuous learning.',
};

function LoginPage() {
  return (
    <AuthTemplate title="Sign in to your account">
      <Login />
    </AuthTemplate>
  );
}

export default LoginPage;
