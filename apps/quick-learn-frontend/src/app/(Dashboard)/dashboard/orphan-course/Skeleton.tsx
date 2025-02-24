import React from 'react';

function Skeleton() {
  return (
    <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
      {/* Header Section */}
      <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Title */}
          <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded-md" />{' '}
          {/* Subtitle */}
        </div>
      </div>

      {/* Table Section */}
      <div className="flow-root">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Lesson',
                    'course_category_name',
                    'Updated On',
                    'Created On',
                    'Created By',
                  ].map((header) => (
                    <th key={header} scope="col" className="px-4 py-3">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 bg-white">
                {[...Array(10)].map((row) => (
                  <tr key={row} className="border-b border-gray-200">
                    {/* Lesson Name */}
                    <td className="px-4 py-2">
                      <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </td>
                    {/* course_category_name */}
                    <td className="px-4 py-2">
                      <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </td>
                    {/* Updated On */}
                    <td className="px-4 py-2">
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </td>
                    {/* Created On */}
                    <td className="px-4 py-2">
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </td>
                    {/* Created By */}
                    <td className="px-4 py-2">
                      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skeleton;
