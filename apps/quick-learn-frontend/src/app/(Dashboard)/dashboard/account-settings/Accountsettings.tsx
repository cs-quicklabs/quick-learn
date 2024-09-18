'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getTeamDetails,
  updateTeamDetails,
} from '@src/apiServices/accountService';
import { en } from '@src/constants/lang/en';
import { UserContext } from '@src/context/userContext';
import { FullPageLoader } from '@src/shared/components/UIElements';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { TTeam } from '@src/shared/types/accountTypes';
import { FieldConfig } from '@src/shared/types/formTypes';
import { noSpecialCharValidation } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const AccountSettingSechema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'This field is mandatory')
    .max(30, 'The value should not exceed 30 character')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    })
    .refine(noSpecialCharValidation, 'Only alphabets and space are allowed'),
  logo: z.union([z.instanceof(File), z.string()]).optional(),
});

type AccountSettingsData = z.infer<typeof AccountSettingSechema>;

const AccountSettings = () => {
  const { user, setUser } = useContext(UserContext);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
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
    setIsPageLoading(true);
    getTeamDetails()
      .then((res) => {
        setValue('name', res.data.name);
        setValue('logo', res.data.logo);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  }, [setValue]);

  function onSubmit(data: AccountSettingsData) {
    updateTeamDetails(data as TTeam)
      .then((res) => {
        showApiMessageInToast(res);
        if (user) {
          setUser({
            ...user,
            team: { ...user.team, name: data.name },
          });
        }
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      {isPageLoading && <FullPageLoader />}
      <div>
        <h1 className="text-lg font-semibold">{en.common.teamSettings}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {en.common.changeSettingsOfYourTeam}
        </p>
        <FormProvider {...methods}>
          <FormFieldsMapper
            fields={accountSettingsFields}
            schema={AccountSettingSechema}
            onSubmit={onSubmit}
            methods={methods}
            isLoading={isLoading}
            buttonText="Save"
            id="accountSettingsForm"
          />
        </FormProvider>
      </div>
    </>
  );
};

export default AccountSettings;
