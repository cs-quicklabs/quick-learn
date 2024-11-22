'use client';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { RouteEnum } from '@src/constants/route.enum';
import { logoutApiCall } from '@src/apiServices/authService';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@src/context/userContext';
import { UserTypeIdEnum } from 'lib/shared/src';
import ConformationModal from '../modals/conformationModal';
import { en } from '@src/constants/lang/en';
import { getInitials } from '@src/utils/helpers';

type TLink = { name: string; link: string; isExtended?: boolean };

const team: TLink = { name: 'Team', link: RouteEnum.TEAM };
const myLearningPath: TLink = {
  name: 'My Learning Paths',
  link: RouteEnum.MY_LEARNING_PATH,
};
const content: TLink = { name: 'Content', link: RouteEnum.CONTENT };
const approvals: TLink = { name: 'Approvals', link: RouteEnum.APPROVALS };
const community: TLink = { name: 'Community', link: RouteEnum.COMMUNITY };

const superAdminUserLinks: TLink[] = [
  team,
  myLearningPath,
  content,
  approvals,
  community,
];
const adminUserLinks: TLink[] = [team, myLearningPath, content, approvals];
const editorUserLinks: TLink[] = [myLearningPath, content];
const memberUserLinks: TLink[] = [myLearningPath];

const menuItems: TLink[] = [
  {
    name: 'Account Settings',
    link: RouteEnum.ACCOUNT_SETTINGS,
  },
  {
    name: 'My Profile',
    link: RouteEnum.PROFILE_SETTINGS,
  },
  {
    name: 'Archive',
    link: RouteEnum.ARCHIVED_USERS,
  },
  {
    name: 'Change-Logs',
    link: RouteEnum.CHANGE_LOGS,
    isExtended: true,
  },
  {
    name: 'Feature Roadmaps',
    link: RouteEnum.FEATURE_LOGS,
    isExtended: true,
  },
];

const Navbar = () => {
  const [links, setLinks] = useState<TLink[]>([]);
  const [showConformationModal, setShowConformationModal] = useState(false);
  const { user } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user?.user_type_id === UserTypeIdEnum.SUPERADMIN) {
      setLinks(superAdminUserLinks);
    } else if (user?.user_type_id === UserTypeIdEnum.ADMIN) {
      setLinks(adminUserLinks);
    } else if (user?.user_type_id === UserTypeIdEnum.EDITOR) {
      setLinks(editorUserLinks);
    } else if (user?.user_type_id === UserTypeIdEnum.MEMBER) {
      setLinks(memberUserLinks);
    }
  }, [user]);

  async function doLogout() {
    try {
      await logoutApiCall();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  const renderMenuItem = (item: TLink) => {
    if (item.isExtended) {
      return (
        <MenuItem key={item.link}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {item.name}
          </a>
        </MenuItem>
      );
    }

    return (
      <MenuItem key={item.link}>
        <Link
          href={item.link}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {item.name}
        </Link>
      </MenuItem>
    );
  };

  return (
    <>
      <ConformationModal
        title={en.common.logoutConformation}
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={doLogout}
        cancelText={en.common.no}
        confirmText={en.common.yes}
      />
      <Disclosure
        as="nav"
        className="bg-gray-800 text-white shadow fixed z-10 w-full top-0"
      >
        <div className="mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex py-2 justify-between align-center">
            <div className="flex px-2 lg:px-0">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  id="homeLogo"
                  href={RouteEnum.MY_LEARNING_PATH}
                  className="items-center justify-center text-white font-extrabold font-mono px-3 hidden lg:flex tracking-wider"
                >
                  {en.common.quickLearn}
                </Link>
                <span className="text-white font-medium px-3 block lg:hidden"></span>
              </div>
              <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
                {links.map((item, index) => (
                  <Link
                    key={item.link}
                    href={item.link}
                    id={`navDesktop${index}`}
                    className={
                      'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 ' +
                      ((item.link != RouteEnum.DASHBOARD &&
                        pathname.includes(item.link)) ||
                      item.link == pathname
                        ? 'text-white bg-gray-500 rounded-md'
                        : 'hover:bg-gray-700 hover:text-white')
                    }
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-1 justify-center align-center px-2 lg:ml-6 lg:justify-end">
              <div className="flex align-center w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  {en.component.searchRoadmapCourseLessons}
                </label>
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="search"
                    name="search"
                    type="search"
                    placeholder="Search Roadmaps, Courses or Lessons"
                    className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex lg:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">{en.component.openMenu}</span>
                <Bars3Icon
                  className="block h-6 w-6 group-data-[open]:hidden"
                  aria-hidden="true"
                />
                <XMarkIcon
                  className="hidden h-6 w-6 group-data-[open]:block"
                  aria-hidden="true"
                />
              </DisclosureButton>
            </div>

            <div className="hidden lg:ml-4 lg:block">
              <div className="flex items-center">
                <button
                  type="button"
                  className="relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">
                    {en.component.viewNotification}
                  </span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Updated Profile Menu */}
                <Menu as="div" className="relative ml-4">
                  <MenuButton className="flex items-center">
                    <div className="h-10 w-10 bg-gray-400 rounded-full flex items-center justify-center">
                      {user?.profile_image ? (
                        <Image
                          alt=""
                          src={user.profile_image}
                          className="h-10 w-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span className="text-lg font-medium">
                          {getInitials(user?.first_name, user?.last_name)}
                        </span>
                      )}
                    </div>
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-2 w-64 divide-y divide-gray-100 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* User Info Section */}
                    <div className="px-4 py-3">
                      <p className="text-base text-gray-900 font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.team?.name}
                      </p>
                    </div>

                    {/* Main Menu Items */}
                    <div className="py-1">
                      {user?.user_type_id === UserTypeIdEnum.SUPERADMIN &&
                        menuItems
                          .filter((item) => !item.isExtended)
                          .map((item) => renderMenuItem(item))}
                      {user?.user_type_id !== UserTypeIdEnum.SUPERADMIN && (
                        <MenuItem>
                          <Link
                            href={RouteEnum.PROFILE_SETTINGS}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {en.component.profile}
                          </Link>
                        </MenuItem>
                      )}
                    </div>

                    {/* Extended Menu Items */}
                    <div className="py-1">
                      {menuItems
                        .filter((item) => item.isExtended)
                        .map((item) => renderMenuItem(item))}
                    </div>

                    {/* Sign Out */}
                    <div className="py-1">
                      <MenuItem>
                        <button
                          onClick={() => setShowConformationModal(true)}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {en.component.signOut}
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel className="lg:hidden">
          <div className="border-y border-gray-700">
            {menuItems.map(
              (item, index) =>
                item.isExtended && (
                  <a
                    key={item.link + item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </a>
                ),
            )}
          </div>
          <div className="space-y-1 px-2 pb-3 pt-2">
            {links.map((item, index) => (
              <DisclosureButton
                key={item.link}
                as="a"
                id={`navMobile${index}`}
                href={item.link}
                className={
                  'block rounded-md px-3 py-2 text-base font-medium ' +
                  (pathname === item.link
                    ? 'text-white bg-gray-900'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                }
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Image
                  alt=""
                  src={user?.profile_image || '/placeholder.png'}
                  className="h-10 w-10 rounded-full object-cover"
                  height={40}
                  width={40}
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {user?.email}
                </div>
              </div>
              <button
                type="button"
                className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">{en.component.viewNotification}</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {user?.user_type_id === UserTypeIdEnum.SUPERADMIN &&
                menuItems.map(
                  (item, index) =>
                    item.isExtended === undefined && (
                      <DisclosureButton
                        as="a"
                        id={`profileMenuMobile${index}`}
                        key={item.link + item.name}
                        href={item.link}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </DisclosureButton>
                    ),
                )}
              {user?.user_type_id !== UserTypeIdEnum.SUPERADMIN ? (
                <DisclosureButton
                  as="a"
                  href={RouteEnum.PROFILE_SETTINGS}
                  id="myProfileMobile"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  My Profile
                </DisclosureButton>
              ) : (
                ''
              )}
              <div className="border-y border-gray-700">
                {menuItems.map(
                  (item, index) =>
                    item.isExtended && (
                      <Link
                        id={`profileMenuMobile${index}`}
                        key={item.link + item.name}
                        href={item.link}
                        target="_blank"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    ),
                )}
              </div>
              <DisclosureButton
                as="a"
                id="signOutMobile"
                onClick={doLogout}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Sign out
              </DisclosureButton>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default Navbar;
