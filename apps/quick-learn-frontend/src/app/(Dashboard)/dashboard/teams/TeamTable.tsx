// components/TeamTable.tsx
import { useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { DateFormats } from '@src/constants/dateFormats';
import { CustomClipBoardIcon } from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import TeamMemberListingSkeleton from './TeamMemberListingSkeleton';
import { RootState } from '@src/store/store';
import { fetchTeamMembers } from '@src/store/features/teamSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';

const TeamTable = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isInitialLoad,
    users,
    currentPage,
    currentUserType,
    searchQuery,
  } = useAppSelector((state: RootState) => ({
    isLoading: state.team.isLoading,
    isInitialLoad: state.team.isInitialLoad,
    users: state.team.users,
    currentPage: state.team.currentPage,
    currentUserType: state.team.currentUserType,
    searchQuery: state.team.searchQuery,
  }));

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
  }, [dispatch, currentPage, currentUserType, searchQuery]);

  // Only show skeleton loader on initial load
  if (isInitialLoad && isLoading) return <TeamMemberListingSkeleton />;

  return (
    <div className="flow-root">
      <div
        className={`-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ${
          isLoading ? 'opacity-60' : ''
        }`}
      >
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-500">
            {/* Rest of the table code remains the same */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
              <tr>
                <th scope="col" className="px-4 py-3">
                  {en.teams.User}
                </th>
                <th scope="col" className="px-4 py-3">
                  {en.teams.Role}
                </th>
                <th scope="col" className="px-4 py-3">
                  {en.teams.Email}
                </th>
                <th scope="col" className="px-4 py-3 text-nowrap">
                  {en.teams.PrimarySkill}
                </th>
                <th scope="col" className="px-4 py-3">
                  {en.teams.Status}
                </th>
                <th scope="col" className="px-4 py-3 text-nowrap">
                  {en.teams.lastLogin}
                </th>
                <th scope="col" className="px-4 py-3 text-nowrap">
                  {en.teams.addedOn}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  id={`row${index}`}
                  key={user.uuid}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap capitalize hover:underline">
                    <Link href={`${RouteEnum.TEAM}/${user.uuid}`}>
                      {user.first_name} {user.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <div className="inline-flex items-center bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded capitalize">
                      <CustomClipBoardIcon color="#1e40af" />
                      <span>{user.user_type.name || 'Role'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 lowercase">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.skill.name}</td>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    <div className="inline-flex items-center">
                      <div
                        className={`w-3 h-3 mr-2 border border-gray-200 rounded-full ${
                          user.active ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      {user.active ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {(user.last_login_timestamp &&
                      format(
                        user.last_login_timestamp,
                        DateFormats.shortDate,
                      )) ||
                      'Not logged in.'}
                  </td>
                  <td className="px-4 py-2">
                    {format(user.created_at, DateFormats.shortDate)}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-2 font-medium text-gray-900 text-center"
                  >
                    {en.common.noResultFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Optional loading indicator for non-initial loads */}
      {isLoading && !isInitialLoad && (
        <div className="fixed top-4 right-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
        </div>
      )}
    </div>
  );
};

export default TeamTable;
