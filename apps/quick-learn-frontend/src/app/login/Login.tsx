'use client';
import React from 'react';
import { loginFormSchema } from './loginFormSchema';
import Link from 'next/link';
import { FieldConfig } from '@src/shared/types/formTypes';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { RouteEnum } from '@src/constants/route.enum';
import { useLogin } from '../../hooks/useAuth';
import { LoginCredentials } from '@src/shared/types/authTypes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
      const res = (await loginUser(data)) as unknown as {
        success: boolean;
        data: { accessToken: string };
      };
      console.log(res);
      if (!res.success) throw new Error();
      toast.success('Login Success!');
      // if login is correct then redirect to Dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // TBD: Need to fix error messages
      // toast.error(`Login Failed: ${error}`);
      toast.error('Unauthorized Creds!');
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
