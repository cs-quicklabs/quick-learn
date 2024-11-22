'use client';
import { changePasswordService } from '@src/apiServices/profileService';
import { en } from '@src/constants/lang/en';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useState } from 'react';
import { z } from 'zod';

const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(1, { message: en.common.fieldRequired }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'Current and new passwords cannot be the same.',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordData = z.infer<typeof changePasswordFormSchema>;

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const changePasswordFields: FieldConfig[] = [
    {
      label: 'Old Password',
      name: 'oldPassword',
      type: 'password',
      placeholder: '••••••••',
    },
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

  const onSubmit = (data: ChangePasswordData) => {
    setIsLoading(true);
    const payload = {
      newPassword: data.newPassword,
      oldPassword: data.oldPassword,
    };
    changePasswordService(payload)
      .then((res) => showApiMessageInToast(res))
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      <div>
        <h1 className="text-lg font-semibold dark:text-white">
          {en.ProfileSetting.changePassword}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {en.ProfileSetting.changePasswordRequest}
        </p>
        <FormFieldsMapper
          fields={changePasswordFields}
          schema={changePasswordFormSchema}
          onSubmit={onSubmit}
          resetFormOnSubmit
          buttonText="Save"
          id="changePasswordForm"
          isLoading={isLoading}
          mode="onChange"
        />
      </div>
    </>
  );
};

export default ChangePassword;
