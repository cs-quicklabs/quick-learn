'use client';
import FormFieldsMapper from 'apps/quick-learn-frontend/src/shared/formElements/FormFieldsMapper';
import AuthTemplate from 'apps/quick-learn-frontend/src/shared/pageTemplates/AuthTemplate';
import { FieldConfig } from 'apps/quick-learn-frontend/src/shared/types/formTypes';

import React from 'react';
import { loginFormSchema } from './loginFormSchema';
import Link from 'next/link';
import { z } from 'zod';

const Login = () => {
  const loginFields: FieldConfig[] = [
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'name@company.com',
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: '••••••••',
    },
    { label: 'Remember me', name: 'rememberMe', type: 'checkbox' },
  ];
  type LoginFormData = z.infer<typeof loginFormSchema>;

  const handleLogin = async (data: LoginFormData) => {
    console.log('Login data:', data);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
        </h1>
        <FormFieldsMapper
          fields={loginFields}
          schema={loginFormSchema}
          onSubmit={handleLogin}
          buttonText="Sign In"
        />
        <Link
          href="/forgot-password"
          className="block text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
