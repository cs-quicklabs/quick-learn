import React from 'react';

function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm w-full animate-pulse">
      <div className="px-6 py-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-4" />
        {/* Progress skeleton section - commented out temporarily */}
        {/*
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-2 bg-gray-200 rounded-full w-full"></div>
      */}
        {/* Spacer to maintain height */}
        <div className="h-[42px]" />
      </div>
    </div>
  );
}

export default CardSkeleton;
