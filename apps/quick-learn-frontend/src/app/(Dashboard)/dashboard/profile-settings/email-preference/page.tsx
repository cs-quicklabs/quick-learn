import React from 'react';

const page = () => {
  return (
    <>
      <div>
        <h1 className="text-lg font-semibold dark:text-white">Preference</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Please change your personal preferences.
        </p>

        <div className="flex mt-6">
          <div className="flex items-center h-5">
            <input
              id="helper-checkbox"
              aria-describedby="helper-checkbox-text"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="ms-2 text-sm">
            <label
              htmlFor="helper-checkbox"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              Enable All Email Alerts
            </label>
            <p
              id="helper-checkbox-text"
              className="text-sm font-normal text-gray-400 dark:text-gray-300"
            >
              If disabled, no email alert will land in your inbox.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
