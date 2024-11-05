import React from 'react';

const EmailPreferenceSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Header Section */}
      <div className="space-y-2 mb-6">
        <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
        {/* Title */}
        <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
        {/* Subtitle */}
      </div>

      {/* Checkbox Section */}
      <div className="flex mt-6">
        {/* Checkbox */}
        <div className="flex items-center h-5">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>

        {/* Text Content */}
        <div className="ms-2 space-y-2">
          {/* Label */}
          <div className="h-5 w-44 bg-gray-200 dark:bg-gray-700 rounded-md" />
          {/* Helper Text */}
          <div className="h-5 w-72 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default EmailPreferenceSkeleton;
