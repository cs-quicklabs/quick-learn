'use client';
import React from 'react';
import Link from 'next/link';

interface ProgressCardProps {
  id: number;
  name: string;
  title: string;
  percentage?: number;
  link: string;
  className?: string;
}

const ProgressCard = ({
  id,
  name,
  title,
  percentage = 0,
  link,
  className = 'bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow group duration-200 text-left',
}: ProgressCardProps) => {
  return (
    <Link href={link} id={id.toString()} className={className}>
      <div className="px-6 py-4">
        <h3 className="text-gray-900 font-medium mb-2 line-clamp-3 group-hover:underline">
          {name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{title}</p>
        {/* Progress section - commented out temporarily */}
        {/*
        <div className="flex items-center text-sm text-gray-500 mb-2 font-bold">
          {percentage}% {en.common.complete}
        </div>
        <ProgressBar percentage={percentage} />
        */}
        {/* Spacer to maintain height */}
        {/* <div className="h-[42px]" /> */}
      </div>
    </Link>
  );
};

export default ProgressCard;
