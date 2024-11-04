'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface ProgressCardProps {
  id: number;
  name: string;
  title: string;
  percentage?: number;
  type: 'roadmap' | 'course';
}

const ProgressCard = ({
  id,
  name,
  title,
  percentage = 0,
  type,
}: ProgressCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    const route =
      type === 'course'
        ? `/dashboard/content/courses/${id}`
        : `/dashboard/content/${id}`;

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
        {/* Progress section - commented out temporarily */}
        {/*
        <div className="flex items-center text-sm text-gray-500 mb-2 font-bold">
          {percentage}% {en.common.complete}
        </div>
        <ProgressBar percentage={percentage} />
        */}
        {/* Spacer to maintain height */}
        <div className="h-[42px]" />
      </div>
    </div>
  );
};

export default ProgressCard;
