'use client';
import Image from 'next/image';
import React from 'react';
import { FieldConfig } from '../../shared/types/formTypes';
import { resetPasswordFormSchema } from './resetPasswordSchema';
import { z } from 'zod';
import FormFieldsMapper from '../../shared/formElements/FormFieldsMapper';

const Resetpasswordcomp = () => {
  const resetPasswordFields: FieldConfig[] = [
    {
      label: 'New Password',
      name: 'newPassword',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      label: 'Confirm Password',
      name: 'confirmPassword',
      type: 'password',
      placeholder: '••••••••',
    },
  ];
  type LoginFormData = z.infer<typeof resetPasswordFormSchema>;

  const handleResetPassword = async (data: LoginFormData) => {
    console.log('forgotPassword data:', data);
  };
  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Set your Password
        </h2>
        <FormFieldsMapper
          fields={resetPasswordFields}
          schema={resetPasswordFormSchema}
          onSubmit={handleResetPassword}
          buttonText="Set password"
        />
      </div>
    </div>
  );
};

export default Resetpasswordcomp;
