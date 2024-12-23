import React from 'react';
import ForgotPassword from './ForgotPassword';
import { Metadata } from 'next';
import AuthTemplate from '@src/shared/pageTemplates/AuthTemplate';

export const metadata: Metadata = {
  title: 'Forgot Password • Quick Learn',
  description:
    'Get instructions to reset your password in Quick Learn from Crownstack',
};

const ForgotPasswordPage = () => {
  return (
    <AuthTemplate title="Forgot your password?">
      <ForgotPassword />
    </AuthTemplate>
  );
};

export default ForgotPasswordPage;
