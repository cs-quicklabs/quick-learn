import React from 'react';

function TeamMemberListingSkeleton() {
  return (
    <>
      <section className="relative overflow-hidden bg-white shadow-md sm:rounded-xs">
        {/* Header Section */}
        <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <div className="space-y-2">
            <div className="h-6 w-20 bg-gray-200 rounded-md" />
            <div className="h-5 w-64 bg-gray-200 rounded-md" />
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="h-10 w-64 bg-gray-200 rounded-lg" />{' '}
            {/* Search */}
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />{' '}
            {/* Add Button */}
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-x-8 p-4 border-t border-b border-gray-300">
          <div className="h-5 w-36 bg-gray-200 rounded-md" />{' '}
          {/* Filter Label */}
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-200 rounded-xs" />
                <div className="h-5 w-16 bg-gray-200 rounded-md" />
              </div>
            ))}
            <div className="h-5 w-16 bg-gray-200 rounded-md" />{' '}
            {/* Show All */}
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
                      'User',
                      'Role',
                      'Email',
                      'Primary Skill',
                      'Status',
                      'Last Login',
                      'Added On',
                    ].map((header) => (
                      <th key={header} scope="col" className="px-4 py-3">
                        <div className="h-4 w-20 bg-gray-200 rounded-md" />
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200 bg-white">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      {/* User Column */}
                      <td className="px-4 py-3">
                        <div className="h-5 w-32 bg-gray-200 rounded-md" />
                      </td>
                      {/* Role Column */}
                      <td className="px-4 py-3">
                        <div className="h-6 w-24 bg-gray-200 rounded-full" />
                      </td>
                      {/* Email Column */}
                      <td className="px-4 py-3">
                        <div className="h-5 w-48 bg-gray-200 rounded-md" />
                      </td>
                      {/* Primary Skill Column */}
                      <td className="px-4 py-3">
                        <div className="h-5 w-24 bg-gray-200 rounded-md" />
                      </td>
                      {/* Status Column */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 bg-gray-200 rounded-full" />
                          <div className="h-5 w-16 bg-gray-200 rounded-md" />
                        </div>
                      </td>
                      {/* Last Login Column */}
                      <td className="px-4 py-3">
                        <div className="h-5 w-24 bg-gray-200 rounded-md" />
                      </td>
                      {/* Added On Column */}
                      <td className="px-4 py-3">
                        <div className="h-5 w-24 bg-gray-200 rounded-md" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination Section */}
      <div className="flex items-center justify-between my-5">
        <div className="h-5 w-72 bg-gray-200  rounded-md" />{' '}
        {/* Results count */}
        <div className="flex space-x-3">
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />{' '}
          {/* Previous */}
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />{' '}
          {/* Next */}
        </div>
      </div>
    </>
  );
}

export default TeamMemberListingSkeleton;
