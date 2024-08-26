'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getTeamDetails,
  updateTeamDetails,
} from '@src/apiServices/accountService';
import { FullPageLoader } from '@src/shared/components/UIElements';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { TTeam } from '@src/shared/types/accountTypes';
import { FieldConfig } from '@src/shared/types/formTypes';
import { noSpecialCharValidation } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const AccountSettingSechema = z.object({
  name: z
    .string()
    .min(1, 'This field is mandatory')
    .max(30, 'This field should be less than or equal to 30')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    })
    .refine(noSpecialCharValidation, 'Only alphabets and space are allowed'),
  logo: z.union([z.instanceof(File), z.string()]),
});

type AccountSettingsData = z.infer<typeof AccountSettingSechema>;

const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const methods = useForm<AccountSettingsData>({
    resolver: zodResolver(AccountSettingSechema),
    mode: 'onChange',
  });
  const { setValue } = methods;

  const accountSettingsFields: FieldConfig[] = [
    {
      label: 'Upload Team Logo',
      name: 'logo',
      type: 'image',
      placeholder: '',
      image_type: 'team',
    },
    {
      label: 'Team Name',
      name: 'name',
      type: 'text',
      placeholder: 'Team name',
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getTeamDetails()
      .then((res) => {
        setValue('name', res.data.name);
        setValue('logo', res.data.logo);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }, [setValue]);

  function onSubmit(data: TTeam) {
    updateTeamDetails(data)
      .then((res) => showApiMessageInToast(res))
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      {isLoading && <FullPageLoader />}
      <div>
        <h1 className="text-lg font-semibold">Team Settings</h1>
        <p className="text-gray-500 text-sm mb-6">
          Change settings of your team.
        </p>
        <FormProvider {...methods}>
          <FormFieldsMapper
            fields={accountSettingsFields}
            schema={AccountSettingSechema}
            onSubmit={onSubmit}
            methods={methods}
            isLoading={isLoading}
            buttonText="Save"
          />
        </FormProvider>
      </div>
    </>
  );
};

export default AccountSettings;
