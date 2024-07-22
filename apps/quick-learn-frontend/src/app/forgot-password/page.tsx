import React from 'react';
import AuthTemplate from '../../shared/pageTemplates/AuthTemplate';
import ForgotPassword from './ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <AuthTemplate title="Forgot your password?">
      <ForgotPassword />
    </AuthTemplate>
  );
};

export default ForgotPasswordPage;
