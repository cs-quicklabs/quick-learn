'use client';
import React from 'react';
import Link from 'next/link';
import { MdOutlineDone } from 'react-icons/md';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { LessonProgress } from '../types/LessonProgressTypes';

interface ProgressCardProps {
  id: number;
  name: string;
  title: string;
  percentage?: number;
  link: string;
  className?: string;
  isCompleted?: LessonProgress;
}

const ProgressCard = ({
  id,
  name,
  title,
  percentage = 0,
  link,
  className = 'bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow group duration-200 text-left',
  isCompleted,
}: ProgressCardProps) => {
  return (
    <Link href={link} id={id.toString()} className={className}>
      <div className="px-6 py-4">
        <h3 className="text-gray-900 font-medium mb-2 line-clamp-3 group-hover:underline">
          {name}
        </h3>
        <p
          className="text-gray-500 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: title, // Render the sanitized HTML
          }}
        />
        {/* Progress section - commented out temporarily */}
        {/*
        <div className="flex items-center text-sm text-gray-500 mb-2 font-bold">
          {percentage}% {en.common.complete}
        </div>
        <ProgressBar percentage={percentage} />
        */}
        {/* Spacer to maintain height */}
        {/* <div className="h-[42px]" /> */}
        {isCompleted !== undefined && (
          <div className="text-slate-500 text-sm flex gap-2 items-center font-medium">
            <span className="bg-green-600 flex text-white rounded-full w-4 h-4 aspect-square font-bold items-center justify-center  ">
              <MdOutlineDone />
            </span>
            Completed at{' '}
            {format(isCompleted?.completed_date, DateFormats.shortDate)}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProgressCard;
