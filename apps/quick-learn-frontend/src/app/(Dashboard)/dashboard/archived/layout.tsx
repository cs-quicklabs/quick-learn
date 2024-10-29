'use client';
import React, { FC, useEffect } from 'react';
import Sidebar, { TNavLink } from '@src/shared/components/Sidebar';
import { RouteEnum } from '@src/constants/route.enum';
import { ChildrenProp } from '@src/shared/interfaces/propInterface';
import {
  ClipboardWithTick,
  DocumentTextIcon,
  OpenBookIcon,
  ProfileIdentificationCard,
} from '@src/shared/components/UIElements';

const Layout: FC<ChildrenProp> = ({ children }) => {
  const navLinks: TNavLink[] = [
    {
      title: 'Archived Users',
      linkTo: RouteEnum.ARCHIVED_USERS,
      icon: <ProfileIdentificationCard />,
    },
    {
      title: 'Archived Roadmaps',
      linkTo: RouteEnum.ARCHIVED_ROADMAPS,
      icon: <OpenBookIcon />,
    },
    {
      title: 'Archived Courses',
      linkTo: RouteEnum.ARCHIVED_COURSES,
      icon: <ClipboardWithTick />,
    },
    {
      title: 'Archived Lessons',
      linkTo: RouteEnum.ARCHIVED_LESSONS,
      icon: <DocumentTextIcon />,
    },
  ];

  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-10 lg:py-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="px-2 py-4 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <Sidebar navLinks={navLinks} />
        </aside>
        <main className="max-w-xl px-4 pb-12 lg:col-span-8">
          <div className="overflow-hidden bg-white">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
