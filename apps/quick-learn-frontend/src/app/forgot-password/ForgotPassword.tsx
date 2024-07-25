'use client';
import { z } from 'zod';
import Link from 'next/link';
import React from 'react';
import { forgotPasswordSchema } from './forgotPasswordSchema';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { RouteEnum } from '@src/constants/route.enum';
import { FieldConfig } from '@src/shared/types/formTypes';

const ForgotPassword = () => {
  const forgotPasswordFields: FieldConfig[] = [
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'name@company.com',
    },
  ];
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    console.log('forgotPassword data:', data);
  };
  return (
    <>
      <FormFieldsMapper
        fields={forgotPasswordFields}
        schema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
        buttonText="Request Password Reset Instructions"
      />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Login to your account &nbsp;
        <Link
          href={RouteEnum.LOGIN}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default ForgotPassword;
