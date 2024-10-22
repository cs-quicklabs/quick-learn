'use client';
import React, { useState } from 'react';
import { loginFormSchema } from './loginFormSchema';
import { FieldConfig } from '@src/shared/types/formTypes';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { RouteEnum } from '@src/constants/route.enum';
import { LoginCredentials } from '@src/shared/types/authTypes';
import { useRouter } from 'next/navigation';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { loginApiCall } from '@src/apiServices/authService';
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
    loginApiCall(data)
      .then((res) => {
        router.push(RouteEnum.MY_LEARNING_PATH);
        toast.success(res.message);
        setIsLoading(false);
      })
      .catch((err) => {
        showApiErrorInToast(err);
        setIsLoading(false);
      });
  };

  return (
    <FormFieldsMapper
      fields={loginFields}
      schema={loginFormSchema}
      onSubmit={handleLogin}
      buttonDisabled={isLoading}
      bigButton
      buttonText="Sign In"
      id="loginForm"
    />
  );
};

export default Login;
