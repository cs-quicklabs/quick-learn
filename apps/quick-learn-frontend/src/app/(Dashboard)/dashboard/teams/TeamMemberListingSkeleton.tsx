import React from 'react';

function TeamMemberListingSkeleton() {
  return (
    <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
      {/* Header Section */}
      <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
        <div className="space-y-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />{' '}
          {/* Search */}
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />{' '}
          {/* Add Button */}
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-x-8 p-4 border-t border-b border-gray-300">
        <div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
        {/* Filter Label */}
        <div className="flex items-center space-x-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-sm" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>
          ))}
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Show All */}
        </div>
      </div>
    </section>
  );
}

export default TeamMemberListingSkeleton;
