'use client';
import React from 'react';
import FormFieldsMapper from 'apps/quick-learn-frontend/src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from 'apps/quick-learn-frontend/src/shared/types/formTypes';
import { loginFormSchema } from './loginFormSchema';
import Link from 'next/link';
import { RouteEnum } from '../../constants/route.enum';
import { LoginCredentials } from '../../shared/types/authTypes';
import { useLogin } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { loginUser, isLoading, error } = useLogin();
  const router = useRouter();
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

  const handleLogin = async (data: LoginCredentials) => {
    try {
      const res = (await loginUser(data)) as unknown as { accessToken: string };
      if (!res['accessToken']) throw new Error();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', error?.message);
    }
  };

  return (
    <>
      <FormFieldsMapper
        fields={loginFields}
        schema={loginFormSchema}
        onSubmit={handleLogin}
        buttonDisabled={isLoading}
        buttonText="Sign In"
      />
      <Link
        href={RouteEnum.FORGOT_PASSWORD}
        className="block text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
      >
        Forgot password?
      </Link>
    </>
  );
};

export default Login;
