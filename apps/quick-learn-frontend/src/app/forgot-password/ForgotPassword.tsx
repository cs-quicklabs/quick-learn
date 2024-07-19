'use client';
import Link from 'next/link';
import React from 'react';
import { FieldConfig } from '../../shared/types/formTypes';
import { z } from 'zod';
import { forgotPasswordSchema } from './forgotPasswordSchema';
import FormFieldsMapper from '../../shared/formElements/FormFieldsMapper';
import { loginFormSchema } from '../login/loginFormSchema';

const ForgotPassword = () => {
  const forgotPasswordFields: FieldConfig[] = [
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'name@company.com',
    },
  ];
  type LoginFormData = z.infer<typeof forgotPasswordSchema>;

  const handleForgotPassword = async (data: LoginFormData) => {
    console.log('forgotPassword data:', data);
  };
  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Forgot your password?
        </h1>
        <FormFieldsMapper
          fields={forgotPasswordFields}
          schema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}
          buttonText="Request Password Reset Instructions"
        />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Login to your account &nbsp;
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
