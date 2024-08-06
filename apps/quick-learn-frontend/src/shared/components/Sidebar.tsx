import Link from 'next/link';
import React from 'react';
import {
  ClipboardDocumentListIcon,
  LockClosedIcon,
  TagIcon,
  AcademicCapIcon,
} from '@heroicons/react/20/solid';

const Sidebar = () => {
  return (
    <>
      <nav className="space-y-1">
        <Link
          href="/quick-learn/settings/team/general"
          className="bg-gray-200 text-gray-900 hover:bg-gray-200 px-3 py-2 flex items-center text-sm font-medium"
        >
          <ClipboardDocumentListIcon
            aria-hidden="true"
            className="h-5 w-5 text-black-400"
          />
          <span className="truncate ml-2">General</span>
        </Link>
        <Link
          href="/quick-learn/settings/team/skills"
          className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 flex items-center text-sm font-medium"
        >
          <LockClosedIcon
            aria-hidden="true"
            className="h-5 w-5 text-black-400"
          />
          <span className="truncate ml-2">Primary Skills</span>
        </Link>
        <Link
          href="/quick-learn/settings/team/roadmap-categories"
          className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 flex items-center text-sm font-medium"
        >
          <TagIcon aria-hidden="true" className="h-5 w-5 text-black-400" />
          <span className="truncate ml-2">Roadmap Categories</span>
        </Link>
        <Link
          href="/quick-learn/settings/team/courses-categories"
          className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 flex items-center text-sm font-medium"
        >
          <AcademicCapIcon
            aria-hidden="true"
            className="h-5 w-5 text-black-400"
          />
          <span className="truncate ml-2">Courses Categories</span>
        </Link>
      </nav>
    </>
  );
};

export default Sidebar;
