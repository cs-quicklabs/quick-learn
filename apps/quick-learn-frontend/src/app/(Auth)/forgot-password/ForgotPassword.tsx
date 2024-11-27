'use client';
import { z } from 'zod';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from './forgotPasswordSchema';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { RouteEnum } from '@src/constants/route.enum';
import { FieldConfig } from '@src/shared/types/formTypes';
import { forgotPasswordApiCall } from '@src/apiServices/authService';
import { toast } from 'react-toastify';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { en } from '@src/constants/lang/en';

const ForgotPassword = () => {
  const router = useRouter();
  const forgotPasswordFields: FieldConfig[] = [
    {
      label: 'Your Email',
      name: 'email',
      type: 'email',
      placeholder: 'name@company.com',
    },
  ];
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    forgotPasswordApiCall({ email: data.email })
      .then((res) => {
        toast.success(res.message);
        router.push(RouteEnum.LOGIN);
      })
      .catch((err) => showApiErrorInToast(err));
  };
  return (
    <>
      <FormFieldsMapper
        fields={forgotPasswordFields}
        schema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
        buttonText="Request Password Reset Instructions"
        id="forgotPasswordForm"
        bigButton={true}
      />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        {en.Auth.Login} &nbsp;
        <Link
          href={RouteEnum.LOGIN}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          {en.Auth.SignIn}
        </Link>
      </p>
    </>
  );
};

export default ForgotPassword;
