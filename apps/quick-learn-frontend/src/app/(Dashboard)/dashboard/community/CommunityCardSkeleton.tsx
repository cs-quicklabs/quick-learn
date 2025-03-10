import React from 'react';

function CommunityCoursesSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Heading Skeleton */}
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto h-12 bg-gray-200 rounded-sm w-3/4 max-w-lg" />
        <div className="mx-auto h-4 bg-gray-200 rounded-sm w-1/2" />
        <div className="mx-auto h-4 bg-gray-200 rounded-sm w-32" />
      </div>

      {/* Course Grid Skeleton */}
      <div className="mt-10">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
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
  );
}

export default CommunityCoursesSkeleton;
