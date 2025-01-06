import Link from 'next/link';
import React from 'react';

interface RouteTabProps {
  id: number;
  name: string;
  baseLink: string;
  course_id?: number;
  roadmap_id?: number;
  type: 'roadmaps' | 'courses' | 'lesson';
  onClick?: () => void;
}

const RouteTab: React.FC<RouteTabProps> = ({
  id,
  name,
  course_id,
  baseLink,
  type,
  onClick,
}) => {
  const navLinks: Record<'roadmaps' | 'courses' | 'lesson', string> = {
    roadmaps: `${baseLink}/${id}`,
    courses: `${baseLink}/course/${id}`,
    lesson: course_id ? `${baseLink}/course/${course_id}/${id}` : '#',
  };

  const link = navLinks[type];

  return (
    <Link href={link}>
      <div
        onClick={onClick}
        className="cursor-pointer flex justify-between items-center text-slate-600 font-normal hover:bg-slate-200 px-3 py-2 active:bg-slate-500"
      >
        <span className="capitalize text-sm line-clamp-2 w-full">{name}</span>
      </div>
    </Link>
  );
};

export default RouteTab;
