'use client';
import Link from 'next/link';
import React from 'react';
import { FieldConfig } from '../../shared/types/formTypes';
import { z } from 'zod';
import { forgotPasswordSchema } from './forgotPasswordSchema';
import FormFieldsMapper from '../../shared/formElements/FormFieldsMapper';
import { RouteEnums } from '../../constants/route.enums';

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
          href={RouteEnums.LOGIN}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default ForgotPassword;
