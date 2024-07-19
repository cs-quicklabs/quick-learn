'use client';
import FormFieldsMapper from 'apps/quick-learn-frontend/src/shared/formElements/FormFieldsMapper';
import AuthTemplate from 'apps/quick-learn-frontend/src/shared/pageTemplates/AuthTemplate';
import { FieldConfig } from 'apps/quick-learn-frontend/src/shared/types/formTypes';

import React from 'react';
import { loginFormSchema } from './loginFormSchema';

const Login = () => {
  const loginFields: FieldConfig[] = [
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Password', name: 'password', type: 'password' },
    { label: 'Remember me', name: 'rememberMe', type: 'checkbox' },
  ];
  return (
    <AuthTemplate>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <FormFieldsMapper
            fields={loginFields}
            schema={loginFormSchema}
            onSubmit={() => {}}
            buttonText="Sign In"
          />
        </div>
      </div>
    </AuthTemplate>
  );
};

export default Login;
