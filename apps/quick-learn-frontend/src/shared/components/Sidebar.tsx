'use client';
import Link from 'next/link';
import React, { FC } from 'react';
import { RouteEnum } from '@src/constants/route.enum';
import { usePathname } from 'next/navigation';

export type TNavLink = {
  title: string;
  linkTo: RouteEnum;
  icon: React.ReactNode;
};

interface Props {
  navLinks: TNavLink[];
}

const Sidebar: FC<Props> = ({ navLinks }) => {
  const pathname = usePathname();
  return (
    <>
      <nav className="space-y-1">
        {navLinks.map(({ title, linkTo, icon }) => (
          <Link
            href={linkTo}
            className={`${
              pathname === linkTo && 'bg-gray-200'
            } text-gray-900 hover:bg-gray-200 px-3 py-2 flex items-center text-sm font-medium`}
          >
            {icon}
            <span className="truncate ml-2">{title}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
