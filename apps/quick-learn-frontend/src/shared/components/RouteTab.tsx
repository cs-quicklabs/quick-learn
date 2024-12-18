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
  roadmap_id,
  baseLink,
  type,
  onClick,
}) => {
  const navLinks: Record<'roadmaps' | 'courses' | 'lesson', string> = {
    roadmaps: `${baseLink}/${id}`,
    courses: `${baseLink}/course/${id}`,
    lesson:
      roadmap_id && course_id
        ? `${baseLink}/${roadmap_id}/${course_id}/${id}`
        : '#',
  };

  const link = navLinks[type];

  return (
    <Link href={link}>
      <div
        onClick={onClick}
        className="cursor-pointer flex justify-between items-center hover:bg-slate-200 px-5 py-2  line-clamp-1 active:bg-slate-500"
      >
        <span className="capitalize">{name}</span>
        <span className="text-xs border text-gray-400 border-gray-400 rounded-md p-1 hover:scale-105">
          Jump to
        </span>
      </div>
    </Link>
  );
};

export default RouteTab;
