// components/TeamTable.tsx
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { CustomClipBoardIcon } from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { selectTeamListingData } from '@src/store/features/teamSlice';
import { useAppSelector } from '@src/store/hooks';
import { SuperLink } from '@src/utils/HiLink';

function TeamTable() {
  const { isLoading, isInitialLoad, users } = useAppSelector(
    selectTeamListingData,
  );

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
                <th scope="col" className="px-4 py-3 text-nowrap">
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
                    <SuperLink href={`${RouteEnum.TEAM}/${user.id}`}>
                      {user.first_name} {user.last_name}
                    </SuperLink>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="inline-flex items-center bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-sm capitalize">
                      <CustomClipBoardIcon color="#1e40af" />
                      <span>{user.user_type.name || 'Role'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 lowercase whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 capitalize whitespace-nowrap">
                    {user.skill.name}
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    <div className="inline-flex items-center">
                      <div
                        className={`w-3 h-3 mr-2 border border-gray-200 rounded-full ${
                          user.active ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      {user.active ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {(user.last_login_timestamp &&
                      format(
                        user.last_login_timestamp,
                        DateFormats.shortDate,
                      )) ||
                      'Not logged in.'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
        </div>
      )}
    </div>
  );
}

export default TeamTable;
