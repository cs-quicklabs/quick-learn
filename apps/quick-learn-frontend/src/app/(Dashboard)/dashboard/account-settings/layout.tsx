import React, { FC } from 'react';
import Sidebar, { TNavLink } from '@src/shared/components/Sidebar';
import { RouteEnum } from '@src/constants/route.enum';
import {
  ClipboardDocumentListIcon,
  LockClosedIcon,
  TagIcon,
  AcademicCapIcon,
} from '@heroicons/react/20/solid';
import { ChildrenProp } from '@src/shared/interfaces/propInterface';

const layout: FC<ChildrenProp> = ({ children }) => {
  const navLinks: TNavLink[] = [
    {
      title: 'General',
      linkTo: RouteEnum.ACCOUNT_SETTINGS,
      icon: (
        <ClipboardDocumentListIcon
          aria-hidden="true"
          className="h-5 w-5 text-black-400"
        />
      ),
    },
    {
      title: 'Primary Skills',
      linkTo: RouteEnum.PRIMARY_SKILLS,
      icon: (
        <LockClosedIcon aria-hidden="true" className="h-5 w-5 text-black-400" />
      ),
    },
    {
      title: 'Roadmap Categories',
      linkTo: RouteEnum.ROADMAP_CATEGORIES,
      icon: <TagIcon aria-hidden="true" className="h-5 w-5 text-black-400" />,
    },
    {
      title: 'Courses Categories',
      linkTo: RouteEnum.COURSES_CATEGORIES,
      icon: (
        <AcademicCapIcon
          aria-hidden="true"
          className="h-5 w-5 text-black-400"
        />
      ),
    },
  ];
  return (
    <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        {/* Sidebar */}
        <aside className="px-2 py-6 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <Sidebar navLinks={navLinks} />
        </aside>
        {/* Main Section */}
        <main className="max-w-xl pb-12 px-4 lg:col-span-6">{children} </main>
      </div>
    </main>
  );
};

export default layout;
