import React from 'react';

const SkeletonLoader = () => {
  return (
    <tbody className="animate-pulse">
      {[...Array(20)].map((_, index) => (
        <tr key={+index} className="border-b border-gray-200">
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded-sm w-64" />
          </td>
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded-sm w-16" />
          </td>
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded-sm w-20" />
          </td>
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded-sm w-20" />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonLoader;
