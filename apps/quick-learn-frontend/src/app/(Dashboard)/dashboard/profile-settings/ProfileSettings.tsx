'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getUserProfileService,
  updateUserProfileService,
} from '@src/apiServices/profileService';
import { UserContext } from '@src/context/userContext';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import { onlyAlphabeticValidation } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name should be less than or equal to 50')
    .refine(
      onlyAlphabeticValidation,
      'First name should only contain alphabetic characters',
    ),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name should be less than or equal to 50')
    .refine(
      onlyAlphabeticValidation,
      'Last name should only contain alphabetic characters',
    ),
  profile_image: z.union([z.instanceof(File), z.string()]),
  email: z.string().email('Invalid email address').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  });
  const { setValue } = methods;
  const profileSettingsFields: FieldConfig[] = [
    {
      label: 'Upload avatar',
      name: 'profile_image',
      type: 'image',
      placeholder: '',
      image_type: 'profile',
    },
    {
      label: 'First Name',
      name: 'first_name',
      type: 'text',
      placeholder: 'Ashish',
    },
    {
      label: 'Last Name',
      name: 'last_name',
      type: 'text',
      placeholder: 'Dhawan',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'john.doe@example.com',
      disabled: true,
    },
  ];

  const onSubmit = (data: ProfileFormData) => {
    setIsLoading(true);
    const { first_name, last_name, profile_image } = data;
    updateUserProfileService({ first_name, last_name, profile_image })
      .then((res) => {
        if (user) {
          setUser({
            ...user,
            ...data,
            profile_image: data.profile_image as string,
          });
        }
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    getUserProfileService()
      .then((res) => {
        setValue('first_name', res.data.first_name);
        setValue('last_name', res.data.last_name);
        setValue('profile_image', res.data.profile_image);
        setValue('email', res.data.email);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }, [setValue]); // Add setValue as a dependency

  return (
    <div>
      <h1 className="text-lg font-semibold">Profile Settings</h1>
      <p className="text-gray-500 text-sm mb-6">
        Change your personal profile settings.
      </p>
      <FormProvider {...methods}>
        <FormFieldsMapper
          fields={profileSettingsFields}
          schema={profileSchema}
          onSubmit={onSubmit}
          methods={methods}
          isLoading={isLoading}
          buttonText="Save"
          id="profileSettingsForm"
        />
      </FormProvider>
    </div>
  );
};

export default ProfileSettings;
