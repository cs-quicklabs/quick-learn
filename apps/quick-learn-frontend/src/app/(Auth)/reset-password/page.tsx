import React from 'react';
import { Metadata } from 'next';
import ResetPassword from './ResetPassword';
import AuthTemplate from '@src/shared/pageTemplates/AuthTemplate';

export const metadata: Metadata = {
  title: 'Reset Password • Quick Learn',
  description: 'Reset your password in Quick Learn from Crownstack',
};

const ResetPasswordPage = () => {
  return (
    <AuthTemplate title="Set your Password">
      <ResetPassword />
    </AuthTemplate>
  );
};

export default ResetPasswordPage;
