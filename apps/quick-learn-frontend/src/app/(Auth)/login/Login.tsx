'use client';
import React, { useEffect, useState } from 'react';
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
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Extract 'redirect' parameter from the URL query string
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        setRedirectUrl(decodeURIComponent(redirect as string));
      } else {
        setRedirectUrl(RouteEnum.MY_LEARNING_PATH);
      }
    }
  }, []);
  const handleLogin = async (data: LoginCredentials) => {
    setIsLoading(true);
    loginApiCall(data)
      .then((res) => {
        router.replace(redirectUrl as string);
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
