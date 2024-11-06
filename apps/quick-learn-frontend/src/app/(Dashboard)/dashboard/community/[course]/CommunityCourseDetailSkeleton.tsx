import React from 'react';

const CommunityCourseDetailsSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Course Header Skeleton */}
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto h-12 bg-gray-200 rounded w-3/4 max-w-lg"></div>
        <div className="mx-auto h-4 bg-gray-200 rounded w-1/2 max-w-2xl"></div>
        <div className="mx-auto h-4 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Lessons Grid Skeleton */}
      <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
        {[...Array(8)].map((_, index) => (
          <li key={index}>
            <div className="bg-white rounded-lg shadow-sm w-full">
              <div className="px-6 py-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityCourseDetailsSkeleton;
