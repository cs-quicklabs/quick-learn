import React from 'react';
import { Metadata } from 'next';
import AuthTemplate from '../../shared/pageTemplates/AuthTemplate';
import Login from './Login';

export const metadata: Metadata = {
  title: 'Quick Learn :: Login',
  description: 'Quick Learn from Crownstack',
};
const LoginPage = () => {
  return (
    <AuthTemplate>
      <Login />
    </AuthTemplate>
  );
};

export default LoginPage;
