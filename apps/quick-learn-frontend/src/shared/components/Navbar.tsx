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
import Image from 'next/image';
import { SuperLink } from '@src/utils/HiLink';

import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { RouteEnum } from '@src/constants/route.enum';
import { logoutApiCall } from '@src/apiServices/authService';
import { useEffect, useState } from 'react';
import { UserTypeIdEnum } from 'lib/shared/src';
import ConformationModal from '../modals/conformationModal';
import { en } from '@src/constants/lang/en';
import { getInitials } from '@src/utils/helpers';
import WebsiteLogo from './WebsiteLogo';
import NavbarSearchBox from './NavbarSearchBox';
import { useSelector } from 'react-redux';
import { selectUser } from '@src/store/features/userSlice';
import { getSystemPreferencesState } from '@src/store/features/systemPreferenceSlice';
import { SystemPreferencesKey } from '../types/contentRepository';

type TLink = {
  name: string;
  link: string;
  isExtended?: boolean;
  showCount?: boolean;
  countKey?: SystemPreferencesKey;
  exclude?: UserTypeIdEnum[];
};

const team: TLink = { name: 'Team', link: RouteEnum.TEAM };
const myLearningPath: TLink = {
  name: 'My Learning Paths',
  link: RouteEnum.MY_LEARNING_PATH,
};
const content: TLink = { name: 'Content', link: RouteEnum.CONTENT };
const approvals: TLink = {
  name: 'Approvals',
  link: RouteEnum.APPROVALS,
  showCount: true,
  countKey: SystemPreferencesKey.UNAPPROVED_LESSONS,
};
const flagged: TLink = {
  name: 'Flagged',
  link: RouteEnum.FLAGGED,
  showCount: true,
  countKey: SystemPreferencesKey.FLAGGED_LESSONS,
};
const community: TLink = { name: 'Community', link: RouteEnum.COMMUNITY };

const adminUserLinks: TLink[] = [
  team,
  myLearningPath,
  content,
  approvals,
  flagged,
];
const superAdminUserLinks: TLink[] = [...adminUserLinks, community];
const editorUserLinks: TLink[] = [team, myLearningPath, content, flagged];
const memberUserLinks: TLink[] = [myLearningPath];

const menuItems: TLink[] = [
  {
    name: 'Account Settings',
    link: RouteEnum.ACCOUNT_SETTINGS,
    exclude: [
      UserTypeIdEnum.ADMIN,
      UserTypeIdEnum.EDITOR,
      UserTypeIdEnum.MEMBER,
    ],
  },
  {
    name: 'My Profile',
    link: RouteEnum.PROFILE_SETTINGS,
    exclude: [],
  },
  {
    name: 'Archive',
    link: RouteEnum.ARCHIVED_USERS,
    exclude: [
      UserTypeIdEnum.ADMIN,
      UserTypeIdEnum.EDITOR,
      UserTypeIdEnum.MEMBER,
    ],
  },
  {
    name: 'Leaderboard', //displayed to every user_type
    link: RouteEnum.LEADERBOARD,
    exclude: [],
  },
  {
    name: 'Orphan Courses', // displayed to superAdmin, Admin, editor
    link: RouteEnum.ORPHANCOURSES,
    exclude: [UserTypeIdEnum.MEMBER],
  },
  {
    name: 'Change-Logs',
    link: RouteEnum.CHANGE_LOGS,
    isExtended: true,
    exclude: [],
  },
  {
    name: 'Feature Roadmaps',
    link: RouteEnum.FEATURE_LOGS,
    isExtended: true,
    exclude: [],
  },
];

function Navbar() {
  const [links, setLinks] = useState<TLink[]>([]);
  const [showConformationModal, setShowConformationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);
  const pathname = usePathname();
  const { metadata: systemPreferenceMetadata } = useSelector(
    getSystemPreferencesState,
  );

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

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  async function doLogout() {
    try {
      localStorage.clear();
      await logoutApiCall();
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  }

  const showCount = (item: TLink, type: string) => {
    return (
      <div
        className={`${
          item?.showCount &&
          item?.countKey &&
          systemPreferenceMetadata[item.countKey] > 0
            ? ''
            : 'hidden'
        }  h-5 w-5 bg-red-700 rounded-full font-bold flex items-center justify-center ${
          type === 'desktop' && 'absolute top-1 ml-20'
        }`}
      >
        {(item?.countKey && systemPreferenceMetadata[item.countKey]) || 0}
      </div>
    );
  };

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
        <SuperLink
          href={item.link}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {item.name}
        </SuperLink>
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
                <SuperLink
                  id="homeLogo"
                  href={RouteEnum.MY_LEARNING_PATH}
                  className="items-center justify-center text-white font-extrabold font-mono px-3 hidden lg:flex tracking-wider"
                >
                  <WebsiteLogo width="45" />
                  <p className="ml-3">{en.common.quickLearn}</p>
                </SuperLink>
                <span className="text-white font-medium px-3 block lg:hidden" />
              </div>
              <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
                {links.map((item, index) => (
                  <SuperLink
                    key={item.link}
                    href={item.link}
                    id={`navDesktop${index}`}
                    className={
                      'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 ' +
                      ((item.link !== RouteEnum.DASHBOARD &&
                        pathname.includes(item.link)) ||
                      item.link === pathname
                        ? 'text-white bg-gray-500 rounded-md'
                        : 'hover:bg-gray-700 hover:text-white')
                    }
                  >
                    {item.name}
                    {showCount(item, 'desktop')}
                  </SuperLink>
                ))}
              </div>
            </div>

            <div className="flex flex-1 justify-center align-center px-2 lg:ml-6 lg:justify-end">
              <div className="flex align-center w-full max-w-lg ">
                <label htmlFor="search" className="sr-only">
                  {en.component.searchRoadmapCourseLessons}
                </label>
                {/* Search functionality for Roadmap, courses and Lesson  */}
                <div className="w-full h-full">
                  <NavbarSearchBox
                    isMember={user?.user_type_id === UserTypeIdEnum.MEMBER}
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
                </button>

                {/* Updated Profile Menu */}
                <Menu as="div" className="relative ml-4">
                  <MenuButton className="flex items-center">
                    <div
                      className="h-10 w-10 bg-gray-400 rounded-full flex items-center justify-center"
                      id="headerProfileImage"
                    >
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
                      <p className="text-base text-gray-900 font-medium first-letter:uppercase">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.team?.name}
                      </p>
                    </div>

                    {/* Main Menu Items */}
                    <div className="py-1">
                      {user &&
                        menuItems
                          .filter((item) => !item.isExtended)
                          .map((item) =>
                            !item.exclude?.includes(user?.user_type_id)
                              ? renderMenuItem(item)
                              : null,
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
                          type="button"
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
              (item) =>
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
                <span className="flex justify-between items-center">
                  {item.name}

                  {showCount(item, 'mobile')}
                </span>
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
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
              <div className="ml-3">
                <div className="text-base font-medium text-white first-letter:uppercase">
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
              </button>
            </div>
            {/* Menu Items */}
            <div className="mt-3 space-y-1 px-2">
              {user &&
                menuItems
                  .filter((item) => !item.isExtended)
                  .map((item, index) =>
                    !item.exclude?.includes(user?.user_type_id) ? (
                      <DisclosureButton
                        as="a"
                        id={`profileMenuMobile${index}`}
                        key={item.link + item.name}
                        href={item.link}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </DisclosureButton>
                    ) : null,
                  )}
              <div className="border-y border-gray-700">
                {menuItems.map(
                  (item, index) =>
                    item.isExtended && (
                      <SuperLink
                        id={`profileMenuMobile${index}`}
                        key={item.link + item.name}
                        href={item.link}
                        target="_blank"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </SuperLink>
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
      <div
        style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          height: '3px',
          width: isLoading ? '100%' : '0',
          backgroundColor: '#2563eb',
          zIndex: 1000,
          transition: 'width 0.3s ease-out',
        }}
      />
    </>
  );
}

export default Navbar;
