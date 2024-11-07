import React from 'react';

const BaseSettingSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Header Section */}
      <div className="space-y-2 mb-6">
        <div className="h-7 w-40 bg-gray-200 rounded-md" />
        <div className="h-5 w-96 bg-gray-200 rounded-md" />
      </div>

      {/* Add Skill Form Section */}
      <div className="mb-8 space-y-2">
        <div className="h-5 w-32 bg-gray-200 rounded-md" /> {/* Label */}
        <div className="flex gap-4">
          <div className="h-10 flex-1 max-w-md bg-gray-200 rounded-md" />{' '}
          {/* Input */}
          <div className="h-10 w-24 bg-gray-200 rounded-md" />{' '}
          {/* Add Button */}
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 p-4">
          <div className="h-6 w-32 bg-gray-200 rounded-md" />
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="h-5 w-48 bg-gray-200 rounded-md" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-md" />{' '}
                {/* Edit button */}
                <div className="h-8 w-8 bg-gray-200 rounded-md" />{' '}
                {/* Delete button */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseSettingSkeleton;
