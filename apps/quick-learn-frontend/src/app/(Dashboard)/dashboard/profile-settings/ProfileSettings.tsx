'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosErrorObject, AxiosSuccessResponse } from '@src/apiServices/axios';
import { updateUserProfileService } from '@src/apiServices/profileService';
import { en } from '@src/constants/lang/en';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import { onlyAlphabeticValidation } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import ProfileSettingsSkeleton from './ProfileSettingsSkeleton';
import { FileUploadResponse } from '@src/shared/types/utilTypes';
import { useSelector } from 'react-redux';
import { selectUser, setUser } from '@src/store/features/userSlice';
import { useAppDispatch } from '@src/store/hooks';

// Define the service input type
interface ProfileUpdateServiceInput {
  first_name: string;
  last_name: string;
  profile_image: string;
}

// Schema for form data
const profileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, en.common.firstNameError)
    .refine(
      onlyAlphabeticValidation,
      'First name should only contain alphabetic characters',
    ),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, en.common.lastNameError)
    .refine(
      onlyAlphabeticValidation,
      'Last name should only contain alphabetic characters',
    ),
  profile_image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .default(''),
  email: z.string().email('Invalid email address').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileSettings() {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      profile_image: '',
      email: '',
    },
  });

  const { reset } = methods;

  const profileSettingsFields: FieldConfig[] = [
    {
      label: 'Upload avatar',
      name: 'profile_image',
      type: 'image',
      placeholder: '',
      image_type: 'profile',
      firstName: user?.first_name,
      lastName: user?.last_name,
    },
    {
      label: 'First Name',
      name: 'first_name',
      type: 'text',
      placeholder: 'John',
    },
    {
      label: 'Last Name',
      name: 'last_name',
      type: 'text',
      placeholder: 'Doe',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'john.doe@example.com',
      disabled: true,
    },
  ];
  //change umage only
  function onChangeImage(
    res: AxiosSuccessResponse<FileUploadResponse> | undefined,
  ) {
    const serviceInput = {
      first_name: user?.first_name,
      last_name: user?.last_name,
      profile_image: res ? res.data.file : '', //handle upload and delete
    };
    if (user) {
      dispatch(
        setUser({
          ...user,
          profile_image: res ? res.data.file : '',
        }),
      );
    }
    updateUserProfileService(serviceInput)
      .then((response) => {
        showApiMessageInToast(response);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      });
  }
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const { first_name, last_name, profile_image } = data;

      // Convert form data to service input type
      const serviceInput: ProfileUpdateServiceInput = {
        first_name,
        last_name,
        profile_image:
          typeof profile_image === 'string'
            ? profile_image
            : user?.profile_image || '',
      };

      const response = await updateUserProfileService(serviceInput);

      if (user) {
        dispatch(
          setUser({
            ...user,
            first_name,
            last_name,
            profile_image: serviceInput.profile_image,
          }),
        );
      }
      showApiMessageInToast(response);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsPageLoading(true);
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image || '',
        email: user.email,
      });
    }
    setIsPageLoading(false);
  }, [user, reset]);

  if (isPageLoading) {
    return <ProfileSettingsSkeleton />;
  }

  return (
    <div className="pb-8">
      <h1 className="text-lg font-semibold">
        {en.ProfileSetting.profileSetting}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.ProfileSetting.changeProfileSetting}
      </p>
      <FormProvider {...methods}>
        <FormFieldsMapper
          fields={profileSettingsFields}
          schema={profileSchema}
          onSubmit={onSubmit}
          methods={methods}
          isLoading={isLoading}
          buttonText="Save"
          onChangeImage={onChangeImage}
          id="profileSettingsForm"
        />
      </FormProvider>
    </div>
  );
}

export default ProfileSettings;
