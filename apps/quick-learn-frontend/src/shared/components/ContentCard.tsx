import React from 'react';
import ProgressBar from './ProgressBar';
const ContentCard = ({
  name,
  title,
  percentage,
}: {
  name: string;
  title: string;
  percentage: number;
}) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full">
    <div className="px-6 py-4">
      <h3 className="text-gray-900 font-medium mb-2">{name}</h3>
      <p className="text-gray-500 text-sm mb-4">{title}</p>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        {percentage}% Complete
      </div>
      <ProgressBar percentage={percentage} />
    </div>
  </div>
);

export default ContentCard;
