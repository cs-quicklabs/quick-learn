import { SuperLink } from '@src/utils/HiLink';
import React from 'react';
import { firstLetterCapital } from '@src/utils/helpers';

interface RouteTabProps {
  id: number;
  name: string;
  baseLink: string;
  course_id?: number;
  type: 'roadmaps' | 'courses' | 'lesson';
  course_name?: string;
  onClick?: () => void;
}

const RouteTab: React.FC<RouteTabProps> = ({
  id,
  name,
  course_id,
  baseLink,
  type,
  course_name,
  onClick,
}) => {
  const navLinks: Record<'roadmaps' | 'courses' | 'lesson', string> = {
    roadmaps: `${baseLink}/${id}`,
    courses: `${baseLink}/course/${id}`,
    lesson: course_id ? `${baseLink}/course/${course_id}/${id}` : '#',
  };

  const link = navLinks[type];

  return (
    <SuperLink href={link}>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer flex justify-between items-center text-slate-600 font-normal hover:bg-slate-200 px-3 py-2 active:bg-slate-500 w-full text-left"
      >
        <span className="capitalize text-sm line-clamp-2 mr-4">
          {firstLetterCapital(name)}
        </span>
        {type === 'lesson' && (
          <span
            id="badge-dismiss-dark"
            className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-sm dark:bg-gray-700 dark:text-gray-300"
          >
            {firstLetterCapital(course_name)}
          </span>
        )}
      </button>
    </SuperLink>
  );
};

export default RouteTab;
