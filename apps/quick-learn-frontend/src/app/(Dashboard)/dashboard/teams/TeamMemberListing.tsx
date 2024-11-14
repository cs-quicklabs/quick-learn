'use client';
import { RouteEnum } from '@src/constants/route.enum';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { TUserType } from '@src/shared/types/userTypes';
import { debounce } from '@src/utils/helpers';
import TeamTable from './TeamTable';

const TeamMemberListing = () => {
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [userTypeCode, setUserTypeCode] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const userTypes: TUserType[] = [
    { name: 'Admin', code: 'admin' },
    { name: 'Editors', code: 'editor' },
    { name: 'Members', code: 'member' },
  ];

  function filterByUserType(code: string) {
    setUserTypeCode(code);
    setPage(1);
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
        setPage(1);
      }, 300),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <div>
            <h1 className="mr-3 text-lg font-semibold">Team</h1>
            <p className="text-gray-500 text-sm">
              Manage all your existing{' '}
              <span className="font-bond">{total}</span> team members or add a
              new one.
            </p>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              placeholder="Search Members"
              value={searchValue}
              onChange={handleSearchChange}
              id="search"
            />
            <Link
              id="addNewMember"
              href={`${RouteEnum.TEAM_EDIT}/add`}
              className="cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white rounded bg-primary-700 hover:bg-primary-800 focus:ring-2 focus:ring-primary-300"
            >
              Add new member
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 p-4 border-t border-b border-gray-300 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <p className="items-center hidden text-sm font-medium text-gray-900 md:flex">
            Show records only for:
          </p>
          <div className="space-y-3 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 md:space-x-4">
            {userTypes.map((userType) => (
              <div key={userType.code} className="flex items-center">
                <input
                  id={userType.code}
                  name="user_type_id"
                  type="radio"
                  onChange={(e) => filterByUserType(userType.code)}
                  checked={userTypeCode === userType.code}
                  className="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor={userType.code}
                  className="ml-2 block text-sm font-medium leading-6 text-gray-900"
                >
                  {userType.name}
                </label>
              </div>
            ))}
            <button
              type="button"
              id="showAll"
              className="underline font-medium text-blue-600 hover:underline text-sm"
              onClick={() => filterByUserType('')}
            >
              Show All
            </button>
          </div>
        </div>

        <TeamTable
          page={page}
          userTypeCode={userTypeCode}
          query={query}
          onTotalChange={setTotal}
        />
      </section>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between my-5">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {page > 1 ? (page - 1) * 10 + 1 : total === 0 ? 0 : 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {page * 10 <= total ? page * 10 : total}
            </span>{' '}
            of <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <div className="flex">
            {page > 1 && (
              <button
                id="prev"
                onClick={() => page > 1 && setPage(page - 1)}
                className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowLeftIcon height={20} width={32} />
                Previous
              </button>
            )}
            {page * 10 < total && (
              <button
                id="next"
                onClick={() => setPage(page + 1)}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
                <ArrowRightIcon height={20} width={32} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMemberListing;
