import React from 'react';

function TeamMemberDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center mb-8">
        <div className="h-4 w-16 bg-gray-200  rounded" />
        <div className="h-4 w-4 bg-gray-200  rounded" />
        <div className="h-4 w-32 bg-gray-200  rounded" />
      </div>

      {/* Member Header */}
      <div className="flex flex-col items-center justify-center mb-10">
        {/* Name */}
        <div className="h-12 w-64 bg-gray-200  rounded-lg mb-2" />
        {/* Stats */}
        <div className="h-4 w-48 bg-gray-200  rounded-sm mb-4" />

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-10 bg-gray-200  rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Roadmaps Section */}
      <section className="mb-12">
        <div className="flex items-baseline mb-6">
          <div className="h-8 w-40 bg-gray-200  rounded-sm mr-2" />
          <div className="h-4 w-20 bg-gray-200  rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {/* Add New Card Skeleton */}
          <div className="h-48 bg-gray-100  rounded-lg border-2 border-dashed border-gray-200  flex items-center justify-center">
            <div className="h-8 w-8 bg-gray-200  rounded" />
          </div>

          {/* Roadmap Card Skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white  rounded-lg border border-gray-200  p-4"
            >
              <div className="h-6 w-3/4 bg-gray-200  rounded-sm mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200  rounded" />
                <div className="h-4 w-2/3 bg-gray-200  rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex items-baseline mb-6">
          <div className="h-8 w-32 bg-gray-200  rounded-sm mr-2" />
          <div className="h-4 w-20 bg-gray-200  rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {/* Course Card Skeletons */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="h-6 w-3/4 bg-gray-200  rounded-sm mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200  rounded" />
                <div className="h-4 w-2/3 bg-gray-200  rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TeamMemberDetailsSkeleton;
