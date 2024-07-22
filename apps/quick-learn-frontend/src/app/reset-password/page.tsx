import React from 'react';
import AuthTemplate from '../../shared/pageTemplates/AuthTemplate';
import ResetPassword from './ResetPassword';

const ResetPasswordPage = () => {
  return (
    <AuthTemplate title="Set your Password">
      <ResetPassword />
    </AuthTemplate>
  );
};

export default ResetPasswordPage;
