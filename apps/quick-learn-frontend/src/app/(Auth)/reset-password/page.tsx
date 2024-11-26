import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ResetPassword from './ResetPassword';
import AuthTemplate from '@src/shared/pageTemplates/AuthTemplate';
import { en } from '@src/constants/lang/en';
export const metadata: Metadata = {
  title: 'Reset Password • Quick Learn',
  description: 'Reset your password in Quick Learn from Crownstack',
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<h1>{en.Auth.loading}</h1>}>
      <AuthTemplate title="Set your Password">
        <ResetPassword />
      </AuthTemplate>
    </Suspense>
  );
};

export default ResetPasswordPage;
