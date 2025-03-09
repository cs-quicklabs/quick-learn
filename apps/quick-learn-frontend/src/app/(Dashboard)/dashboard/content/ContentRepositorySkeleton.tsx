import React from 'react';

function ContentRepositorySkeleton() {
  return (
    <div className="animate-pulse">
      {/* Main Header Skeleton */}
      <div className="px-4 mb-8 sm:flex sm:items-center sm:justify-center sm:px-6 lg:px-8">
        <div className="items-baseline">
          <div className="h-12 bg-gray-200 rounded-sm w-96 mx-auto" />
          <div className="mt-2 h-4 bg-gray-200 rounded-sm w-48 mx-auto" />
        </div>
      </div>

      {/* Roadmaps Section */}
      <div className="px-8 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <div className="h-8 bg-gray-200 rounded-sm w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded-sm w-24 ml-2 mt-1" />
        </div>
      </div>

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
            {/* Roadmap Card Skeletons */}
            {[...Array(4)].map((_, index) => (
              <li key={`roadmap-${index}`}>
                <div className="bg-white rounded-lg shadow-xs w-full">
                  <div className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded-sm w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded-sm w-full mb-4" />
                    <div className="h-4 bg-gray-200 rounded-sm w-1/2" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-8 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <div className="h-8 bg-gray-200 rounded-sm w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded-sm w-24 ml-2 mt-1" />
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-4">
        <div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            {/* Course Card Skeletons */}
            {[...Array(5)].map((_, index) => (
              <li key={`course-${index}`}>
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

export default ContentRepositorySkeleton;
