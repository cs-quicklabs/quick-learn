import React from 'react';

const ChangePasswordSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Header Section */}
      <div className="space-y-2 mb-6">
        <div className="h-7 w-36 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
        {/* Title */}
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
        {/* Subtitle */}
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-md">
        {/* Old Password Field */}
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Label */}
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Input */}
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Label */}
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Input */}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Label */}
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Input */}
        </div>

        {/* Submit Button */}
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md mt-8" />
      </div>
    </div>
  );
};

export default ChangePasswordSkeleton;
