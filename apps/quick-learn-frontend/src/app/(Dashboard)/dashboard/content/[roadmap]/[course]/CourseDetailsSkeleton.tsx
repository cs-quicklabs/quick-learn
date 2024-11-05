'use client';
import React from 'react';

const CourseDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex items-center space-x-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-2">/</div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-2">/</div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>

      {/* Header Section */}
      <div className="items-baseline mb-8">
        {/* Title */}
        <div className="text-center mb-2">
          <div className="h-12 bg-gray-200 rounded w-2/3 max-w-2xl mx-auto"></div>
        </div>

        {/* Created by info */}
        <div className="mt-1 text-center">
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
        </div>

        {/* Stats */}
        <div className="mt-1 text-center">
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-10 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="relative px-6 grid gap-10 pb-4">
        <div>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 xl:gap-x-6">
            {/* Create New Card Skeleton */}
            <li>
              <div className="bg-white rounded-lg shadow-sm w-full border-2 border-dashed border-gray-200 p-6 h-52">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-24"></div>
              </div>
            </li>

            {/* Lesson Card Skeletons */}
            {[...Array(4)].map((_, index) => (
              <li className="h-52" key={index}>
                <div className="bg-white rounded-lg shadow-sm w-full h-full">
                  <div className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;
