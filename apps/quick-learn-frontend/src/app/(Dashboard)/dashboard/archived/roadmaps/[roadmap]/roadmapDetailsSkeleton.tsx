import React from 'react';

function RoadmapDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex justify-center w-full mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded-sm w-32" />
          <div className="h-4 bg-gray-200 rounded-sm w-2" />
          <div className="h-4 bg-gray-200 rounded-sm w-48" />
        </div>
      </div>

      {/* Header Section */}
      <div className="items-baseline mb-8">
        {/* Title */}
        <div className="text-center mb-2">
          <div className="h-12 bg-gray-200 rounded-sm w-2/3 max-w-2xl mx-auto" />
        </div>

        {/* Created by info */}
        <div className="mt-1 text-center">
          <div className="h-4 bg-gray-200 rounded-sm w-64 mx-auto mb-2" />
        </div>

        {/* Stats */}
        <div className="mt-1 text-center">
          <div className="h-4 bg-gray-200 rounded-sm w-80 mx-auto mb-4" />
        </div>

      </div>

      {/* Courses Grid */}
      <div className="relative px-6 grid gap-10 pb-4">
        <div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            {/* Create New Card Skeleton */}
            <li>
              <div className="bg-white rounded-lg shadow-xs w-full border-2 border-dashed border-gray-200 p-6">
                <div className="h-5 bg-gray-200 rounded-sm w-3/4 mb-2" />
                <div className="h-24" />
              </div>
            </li>

            {/* Course Card Skeletons */}
            {[...Array(4)].map((_, index) => (
              <li key={index}>
                <div className="bg-white rounded-lg shadow-xs w-full">
                  <div className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded-sm w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded-sm w-full mb-4" />
                    <div className="h-4 bg-gray-200 rounded-sm w-1/3" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RoadmapDetailsSkeleton;
