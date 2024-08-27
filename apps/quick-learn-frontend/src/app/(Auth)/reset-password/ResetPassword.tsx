'use client';
import React from 'react';
import { z } from 'zod';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import { resetPasswordFormSchema } from './resetPasswordSchema';
import { resetPasswordApiCall } from '@src/apiServices/authService';
import { toast } from 'react-toastify';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouteEnum } from '@src/constants/route.enum';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
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
  type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    const payload = {
      resetToken: token as string,
      newPassword: data.confirmPassword,
    };
    resetPasswordApiCall(payload)
      .then((res) => {
        toast.success(res.message);
        router.push(RouteEnum.LOGIN);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      });
  };

  return (
    <FormFieldsMapper
      fields={resetPasswordFields}
      schema={resetPasswordFormSchema}
      onSubmit={handleResetPassword}
      buttonText="Set password"
      id="resetPasswordForm"
    />
  );
};

export default ResetPassword;
