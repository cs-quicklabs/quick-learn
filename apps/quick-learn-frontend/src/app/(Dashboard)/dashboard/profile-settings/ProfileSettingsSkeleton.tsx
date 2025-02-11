import React from 'react';

function ProfileSettingsSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Section */}
      <div className="space-y-2 mb-6">
        <div className="h-7 w-36 bg-gray-200 rounded-md" /> {/* Title */}
        <div className="h-5 w-64 bg-gray-200 rounded-md" /> {/* Subtitle */}
      </div>

      {/* Form Fields */}
      <div className="space-y-8 max-w-2xl">
        {/* Profile Image Upload */}
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded-md" /> {/* Label */}
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-gray-200" />{' '}
            {/* Avatar */}
            <div className="h-10 w-32 bg-gray-200 rounded-md" />{' '}
            {/* Upload button */}
          </div>
        </div>

        {/* First Name Field */}
        <div className="space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded-md" /> {/* Label */}
          <div className="h-10 w-full bg-gray-200 rounded-md" /> {/* Input */}
        </div>

        {/* Last Name Field */}
        <div className="space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded-md" /> {/* Label */}
          <div className="h-10 w-full bg-gray-200 rounded-md" /> {/* Input */}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <div className="h-5 w-16 bg-gray-200 rounded-md" /> {/* Label */}
          <div className="h-10 w-full bg-gray-200 rounded-md opacity-75" />{' '}
          {/* Disabled input */}
        </div>

        {/* Submit Button */}
        <div className="h-10 w-20 bg-gray-200 rounded-md mt-8" />
      </div>
    </div>
  );
}

export default ProfileSettingsSkeleton;
