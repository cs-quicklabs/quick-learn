'use client';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import React from 'react';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  profileImage: z.instanceof(File).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const profileSettingsFields: FieldConfig[] = [
    {
      label: 'Upload',
      name: 'profileImage',
      type: 'image',
      placeholder:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      placeholder: 'Ashish',
    },
    {
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      placeholder: 'Dhawan',
    },
  ];

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Change your personal profile settings.
        </p>
        <FormFieldsMapper
          fields={profileSettingsFields}
          schema={profileSchema}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
};

export default ProfileSettings;
