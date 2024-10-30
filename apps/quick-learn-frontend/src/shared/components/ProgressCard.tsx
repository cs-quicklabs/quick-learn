'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';

interface ProgressCardProps {
  id: number;
  name: string;
  title: string;
  percentage: number;
  type: 'roadmap' | 'course';
}

const ProgressCard = ({
  id,
  name,
  title,
  percentage,
  type,
}: ProgressCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    const route =
      type === 'course'
        ? `/dashboard/content/courses/${id}` // Course route
        : `/dashboard/content/${id}`; // Roadmap route

    router.push(route);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="px-6 py-4">
        <h3 className="text-gray-900 font-medium mb-2 line-clamp-2">{name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{title}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2 font-bold">
          {percentage}% Complete
        </div>
        <ProgressBar percentage={percentage} />
      </div>
    </div>
  );
};

export default ProgressCard;
