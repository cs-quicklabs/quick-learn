'use client';
import { getTeamDetails } from '@src/apiServices/accountService';
import { TTeams } from '@src/shared/types/accountTypes';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<TTeams[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getTeamDetails()
      .then((res) => {
        setTeamName(res.data.teams);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold dark:text-white">Team Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Change settings of your team.
        </p>
        <form className="w-full mt-6">
          <div className="sm:col-span-2">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload Team Logo
            </label>
            <div className="items-center w-full sm:flex">
              <Image
                className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Helene avatar"
                width={30}
                height={30}
              />
            </div>
          </div>
          <div className="mb-5 mt-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Team Name
            </label>
            <input
              type="text"
              id="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Quick Connect"
              value={teamName[0]?.name}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default AccountSettings;
