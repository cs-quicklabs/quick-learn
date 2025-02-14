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
      <h1 className="text-lg font-semibold dark:text-white">
        {en.ProfileSetting.preferenceHead}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        {en.ProfileSetting.preferenceSubHead}
      </p>

      {isLoading ? (
        <EmailPreferenceSkeleton isPartial />
      ) : (
        <div className="flex mt-6">
          <div className="flex items-center h-5">
            <input
              id="helper-checkbox"
              aria-describedby="helper-checkbox-text"
              type="checkbox"
              checked={isEmailChecked}
              onChange={handleChange}
              className="appearance-none h-5 w-5 border border-gray-300 rounded-lg bg-white checked:bg-blue-500 checked:border-blue-500 focus:outline-none transition duration-100"
            />
          </div>
          <div className="ms-2 text-sm">
            <label
              htmlFor="helper-checkbox"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              {en.ProfileSetting.emailAlerts}
            </label>
            <p
              id="helper-checkbox-text"
              className="text-sm font-normal text-gray-400 dark:text-gray-300"
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
