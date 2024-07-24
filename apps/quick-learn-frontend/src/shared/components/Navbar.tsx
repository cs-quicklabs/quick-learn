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
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { RouteEnum } from '../../constants/route.enum';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

type TLink = { name: string; link: string };

const links: TLink[] = [
  {
    name: 'Dashboard',
    link: RouteEnum.DASHBOARD,
  },
  {
    name: 'Team',
    link: RouteEnum.TEAM,
  },
  {
    name: 'My Learning Path',
    link: RouteEnum.MY_LEARNING_PATH,
  },
];

const menuItems: TLink[] = [
  {
    name: 'Account Settings',
    link: '',
  },
  {
    name: 'My Profile',
    link: '',
  },
  {
    name: 'Archive',
    link: '',
  },
  {
    name: 'Admin Land',
    link: '',
  },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <Disclosure as="nav" className="bg-gray-800 text-white shadow">
      <div className="mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex py-2 justify-between">
          <div className="flex px-2 lg:px-0">
            <div className="flex flex-shrink-0 items-center">
              <Link
                href={RouteEnum.DASHBOARD}
                className="font-mono px-3 hidden lg:block tracking-wider"
              >
                Quick Learn
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
              {links.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className={
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ' +
                    (pathname == item.link
                      ? 'bg-gray-500'
                      : 'hover:bg-gray-600 text-gray-200')
                  }
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop view search box */}
          <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search"
                  className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
                />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
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
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-4 flex-shrink-0">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Image
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                      height={24}
                      width={24}
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in divide-y divide-gray-100"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm text-black">
                      aashishdhawan@gmail.com
                    </p>
                    <p className="text-xs text-gray-700">
                      Crownstack Technologies
                    </p>
                  </div>
                  <div>
                    {menuItems.map((item) => (
                      <MenuItem key={item.link}>
                        <Link
                          href={item.link}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </div>
                  <MenuItem>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 divide-y divide-gray-100"
                    >
                      Sign out
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {links.map((item) => (
            <DisclosureButton
              key={item.link}
              as="a"
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
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="h-10 w-10 rounded-full"
                height={40}
                width={40}
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">Tom Cook</div>
              <div className="text-sm font-medium text-gray-400">
                tom@example.com
              </div>
            </div>
            <button
              type="button"
              className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-3 space-y-1 px-2">
            {menuItems.map((item) => (
              <DisclosureButton
                as="a"
                key={item.link}
                href={item.link}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                {item.name}
              </DisclosureButton>
            ))}
            <DisclosureButton
              as="a"
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Sign out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
