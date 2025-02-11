'use client';
import { RouteEnum } from '@src/constants/route.enum';
import { useMemo, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { TUserType } from '@src/shared/types/userTypes';
import { debounce } from '@src/utils/helpers';
import TeamTable from './TeamTable';
import {
  fetchTeamMembers,
  selectTeamListingData,
  setCurrentPage,
  setCurrentUserType,
  setSearchQuery,
} from '@src/store/features/teamSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { en } from '@src/constants/lang/en';
import { SuperLink } from '@src/utils/HiLink';

function TeamMemberListing() {
  const dispatch = useAppDispatch();
  const [searchInputValue, setSearchInputValue] = useState(''); // Local state for input value

  const { totalUsers, currentPage, currentUserType, filteredTotal } =
    useAppSelector(selectTeamListingData);

  const userTypes: TUserType[] = [
    { name: 'Admin', code: 'admin' },
    { name: 'Editors', code: 'editor' },
    { name: 'Members', code: 'member' },
  ];

  function filterByUserType(code: string) {
    dispatch(setCurrentUserType(code));
    dispatch(setCurrentPage(1));
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchQuery(value));
        dispatch(setCurrentPage(1));
        dispatch(
          fetchTeamMembers({
            page: 1,
            userTypeCode: currentUserType,
            query: value,
          }),
        );
      }, 500),
    [dispatch, currentUserType],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchInputValue(value); // Update local state immediately
    debouncedSearch(value); // Debounce the Redux update and API call
  };

  function showRange() {
    const initial = filteredTotal === 0 ? 0 : (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, filteredTotal);
    return `${initial} ${en.teams.to} ${end} ${en.teams.of} ${filteredTotal}`;
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <div>
            <h1 className="mr-3 text-lg font-semibold">{en.teams.team}</h1>
            <p className="text-gray-500 text-sm">
              {en.teams.manageExisting}{' '}
              <span className="font-bond">{totalUsers}</span>{' '}
              {en.teams.addNewOne}
            </p>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              placeholder="Search Members"
              value={searchInputValue} // Use local state for input value
              onChange={handleSearchChange}
              id="search"
            />
            <SuperLink
              id="addNewMember"
              href={`${RouteEnum.TEAM_EDIT}/add`}
              className="cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white rounded bg-primary-700 hover:bg-primary-800 focus:ring-2 focus:ring-primary-300"
            >
              {en.teams.addNewMember}
            </SuperLink>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 p-4 border-t border-b border-gray-300 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <p className="items-center hidden text-sm font-medium text-gray-900 md:flex">
            {en.teams.showRecordsOnly}
          </p>
          <div className="space-y-3 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 md:space-x-4">
            {userTypes.map((userType) => (
              <div key={userType.code} className="flex items-center">
                <input
                  id={userType.code}
                  name="user_type_id"
                  type="radio"
                  onChange={() => filterByUserType(userType.code)}
                  checked={currentUserType === userType.code}
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
              {en.teams.showAll}
            </button>
          </div>
        </div>

        <TeamTable />
      </section>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between my-5">
        <div>
          <p className="text-sm text-gray-700">
            {en.teams.showing}{' '}
            <span className="font-medium">{showRange()}</span>{' '}
            {en.teams.results}
          </p>
        </div>
        <div>
          <div className="flex">
            {currentPage > 1 && (
              <button
                type="button"
                id="prev"
                onClick={() => {
                  const newPage = currentPage - 1;
                  dispatch(setCurrentPage(newPage));
                  dispatch(
                    fetchTeamMembers({
                      page: newPage,
                      userTypeCode: currentUserType,
                      query: searchInputValue,
                    }),
                  );
                }}
                className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowLeftIcon height={20} width={32} />
                {en.teams.previous}
              </button>
            )}
            {currentPage * 10 < filteredTotal && (
              <button
                type="button"
                id="next"
                onClick={() => {
                  const newPage = currentPage + 1;
                  dispatch(setCurrentPage(newPage));
                  dispatch(
                    fetchTeamMembers({
                      page: newPage,
                      userTypeCode: currentUserType,
                      query: searchInputValue,
                    }),
                  );
                }}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                {en.teams.next}
                <ArrowRightIcon height={20} width={32} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamMemberListing;
