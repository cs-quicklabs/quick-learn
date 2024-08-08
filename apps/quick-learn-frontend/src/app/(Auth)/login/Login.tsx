'use client';
import React from 'react';
import { loginFormSchema } from './loginFormSchema';
import Link from 'next/link';
import { FieldConfig } from '@src/shared/types/formTypes';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { RouteEnum } from '@src/constants/route.enum';
import { useLogin } from '../../../hooks/useAuth';
import { LoginCredentials } from '@src/shared/types/authTypes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';

const Login = () => {
  const { loginUser, isLoading } = useLogin();
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
      const res = await loginUser(data);
      showApiMessageInToast(res);
      router.push(RouteEnum.DASHBOARD);
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
    }
  };

  return (
    <>
      <FormFieldsMapper
        fields={loginFields}
        schema={loginFormSchema}
        onSubmit={handleLogin}
        buttonDisabled={isLoading}
        bigButton
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
