'use client';
import React from 'react';
import Link from 'next/link';
import { MdOutlineDone } from 'react-icons/md';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { LessonProgress } from '../types/LessonProgressTypes';
import { en } from '@src/constants/lang/en';

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
  className = '',
  isCompleted,
}: ProgressCardProps) => {
  const baseClassName = `inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border border-gray-100 group w-full relative transition-shadow duration-200 ${className}`;

  return (
    <Link href={link} id={id.toString()} className={baseClassName}>
      <div className="flex flex-col h-40">
        <div className="flex-1 py-4 px-6 text-gray-900 overflow-hidden">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:underline">
            {name}
          </h3>
          <p
            className="font-normal text-sm text-gray-500 line-clamp-2 mt-2"
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </div>
        <div className="px-6 pb-4">
          {!isCompleted ? (
            <>
              <p className="font-bold text-xs text-gray-500 pb-2">
                {percentage === 0 ? (
                  'Not started yet'
                ) : (
                  <>
                    {percentage}% {en.common.complete}
                  </>
                )}
              </p>
              <div className="overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500 flex gap-2 items-center font-medium">
              <span className="bg-green-600 flex text-white rounded-full w-4 h-4 aspect-square font-bold items-center justify-center">
                <MdOutlineDone />
              </span>
              Completed at{' '}
              {format(isCompleted.completed_date, DateFormats.shortDate)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProgressCard;
