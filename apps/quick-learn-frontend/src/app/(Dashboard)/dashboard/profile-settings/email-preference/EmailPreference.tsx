'use client';
import {
  getUserPreferencesService,
  updateUserPreferencesService,
} from '@src/apiServices/profileService';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';
import EmailPreferenceSkeleton from './EmailPreferenceSkeleton';
import { en } from '@src/constants/lang/en';
import InputCheckbox from '@src/shared/components/InputCheckbox';

function EmailPreference() {
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsPageLoading(true);
    getUserPreferencesService()
      .then((res) => {
        if (res?.data?.preference !== undefined) {
          setIsEmailChecked(res.data.preference);
        }
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  }, []); // Dependency array is empty to ensure this runs only once
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPreference = e.target.checked;
    // Optimistic update
    setIsEmailChecked(newPreference);
    setIsLoading(true);
    // API call to update preference
    updateUserPreferencesService(newPreference)
      .then((res) => {
        if (res?.data?.preference !== undefined) {
          setIsEmailChecked(res.data.preference); // Sync state with server
        }
        showApiMessageInToast(res);
      })
      .catch((err) => {
        setIsEmailChecked(!newPreference); // Revert state on error
        showApiErrorInToast(err);
      })
      .finally(() => setIsLoading(false));
  };

  if (isPageLoading) return <EmailPreferenceSkeleton />;
  return (
    <div>
      <h1 className="text-lg font-semibold">
        {en.ProfileSetting.preferenceHead}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.ProfileSetting.preferenceSubHead}
      </p>

      {isLoading ? (
        <EmailPreferenceSkeleton isPartial />
      ) : (
        <div className="flex mt-6">
          <div className="flex items-center h-5">
            <div className="group grid size-4 grid-cols-1">
              <InputCheckbox
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                className="h-[18px] w-[18px]"
                checked={isEmailChecked}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="ms-2 text-sm">
            <label
              htmlFor="helper-checkbox"
              className="font-medium text-gray-900"
            >
              {en.ProfileSetting.emailAlerts}
            </label>
            <p
              id="helper-checkbox-text"
              className="text-sm font-normal text-gray-400"
            >
              {en.ProfileSetting.alertdisable}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailPreference;
