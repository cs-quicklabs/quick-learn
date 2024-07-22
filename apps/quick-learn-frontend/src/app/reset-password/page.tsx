import React from 'react';
import AuthTemplate from '../../shared/pageTemplates/AuthTemplate';
import ResetPassword from './ResetPassword';
import { Metadata } from 'next';

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
