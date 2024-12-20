'use client';
import React, { FC, useEffect } from 'react';
import Sidebar, { TNavLink } from '@src/shared/components/Sidebar';
import { RouteEnum } from '@src/constants/route.enum';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { ChildrenProp } from '@src/shared/interfaces/propInterface';
import {
  // ClipboardWithTick,
  ProfileIdentificationCard,
} from '@src/shared/components/UIElements';

const Layout: FC<ChildrenProp> = ({ children }) => {
  const navLinks: TNavLink[] = [
    {
      title: 'Profile',
      linkTo: RouteEnum.PROFILE_SETTINGS,
      icon: <ProfileIdentificationCard />,
    },
    {
      title: 'Change Password',
      linkTo: RouteEnum.CHANGE_PASSWORD,
      icon: (
        <LockClosedIcon aria-hidden="true" className="h-5 w-5 text-black-400" />
      ),
    },
    // Not Required now may need in the future
    // {
    //   title: 'Email Preference',
    //   linkTo: RouteEnum.EMAIL_PREFERENCE,
    //   icon: <ClipboardWithTick />,
    // },
  ];

  useEffect(() => {
    // Set body background color when the component mounts
    document.body.style.backgroundColor = 'white';

    // Cleanup function: Change background when leaving the page
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <main className="max-w-7xl mx-auto pb-10 lg:py-6 lg:px-8 ">
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

export default Layout;
