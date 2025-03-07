'use client';
import { RouteEnum } from '@src/constants/route.enum';
import { useEffect, useState } from 'react';
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
import BasicPagination from '@src/shared/components/BasicPagination';
import { selectUser } from '@src/store/features';
import TeamMemberListingSkeleton from './TeamMemberListingSkeleton';
import { toast } from 'react-toastify';
import { UserTypeIdEnum } from 'lib/shared/src';

function TeamMemberListing() {
  const dispatch = useAppDispatch();
  const {
    totalUsers,
    currentPage,
    currentUserType,
    filteredTotal,
    searchQuery,
    totalPages,
    isLoading,
    isInitialLoad,
  } = useAppSelector(selectTeamListingData);

  const [searchInputValue, setSearchInputValue] = useState(searchQuery || ''); // Local state for input value
  const [visibleUserTypes, setVisibleUserTypes] = useState<TUserType[]>([]);
  const user = useAppSelector(selectUser);

  const isEditorUser = user?.user_type_id === UserTypeIdEnum.EDITOR;
  const showAddMemberButton = !isEditorUser;

  const userTypes: TUserType[] = [
    { name: 'Admin', code: 'admin' },
    { name: 'Editors', code: 'editor' },
    { name: 'Members', code: 'member' },
  ];

  useEffect(() => {
    if (isEditorUser) {
      // If user is editor, hide Admin option
      setVisibleUserTypes(userTypes.filter((type) => type.code !== 'admin'));
    } else {
      // Otherwise show all options
      setVisibleUserTypes(userTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isEditorUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(
          fetchTeamMembers({
            page: currentPage,
            userTypeCode: currentUserType,
            query: searchQuery,
          }),
        );
      } catch (error) {
        console.error('API call failed:', error);
        toast.error('Something went wrong!');
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, currentUserType]);

  function filterByUserType(code: string) {
    dispatch(setCurrentUserType(code));
    dispatch(setCurrentPage(1));
  }

  const debouncedSearch = debounce((value: string) => {
    dispatch(setSearchQuery(value));
    dispatch(setCurrentPage(1));
    dispatch(
      fetchTeamMembers({
        page: 1,
        userTypeCode: currentUserType,
        query: value,
      }),
    );
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchInputValue(value); // Update local state immediately
    debouncedSearch(value); // Debounce the Redux update and API call
  };

  if (isLoading && isInitialLoad) {
    return <TeamMemberListingSkeleton />;
  }

  return (
    <div className="relative mx-4 md:mx-0">
      <section className=" overflow-hidden bg-white shadow-md sm:rounded-sm">
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
              className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block touch-none"
              placeholder="Search Members"
              value={searchInputValue} // Use local state for input value
              onChange={handleSearchChange}
              id="search"
            />
            {showAddMemberButton && (
              <SuperLink
                id="addNewMember"
                href={`${RouteEnum.TEAM_EDIT}/add`}
                className="cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white rounded bg-primary-700 hover:bg-primary-800 focus:ring-2 focus:ring-primary-300"
              >
                {en.teams.addNewMember}
              </SuperLink>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 p-4 border-t border-b border-gray-300 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <p className="items-center hidden text-sm font-medium text-gray-900 md:flex">
            {en.teams.showRecordsOnly}
          </p>
          <div className="space-y-3 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 md:space-x-4">
            {visibleUserTypes.map((userType) => (
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

      <BasicPagination
        total={filteredTotal}
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(pageIndex: number) => {
          const newPage = pageIndex || 1;
          dispatch(setCurrentPage(newPage));
          dispatch(
            fetchTeamMembers({
              page: newPage,
              userTypeCode: currentUserType,
              query: searchInputValue,
            }),
          );
        }}
      />
    </div>
  );
}

export default TeamMemberListing;
