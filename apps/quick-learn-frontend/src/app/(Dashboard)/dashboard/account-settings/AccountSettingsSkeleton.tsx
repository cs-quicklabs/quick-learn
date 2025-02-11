import React from 'react';

function AccountSettingsSkeleton() {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="mb-2">
        <div className="h-7 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>
      <div className="mb-6">
        <div className="h-5 w-64 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-6">
        {/* Logo Upload Field */}
        <div className="space-y-2">
          <div className="h-5 w-28 bg-gray-200 rounded-md animate-pulse" />
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Team Name Field */}
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-full max-w-md bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Submit Button */}
        <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse mt-6" />
      </div>
    </div>
  );
}

export default AccountSettingsSkeleton;
