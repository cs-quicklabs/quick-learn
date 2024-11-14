import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { TUser } from '@src/shared/types/userTypes';
import { DateFormats } from '@src/constants/dateFormats';
import { teamListApiCall } from '@src/apiServices/teamService';
import { CustomClipBoardIcon } from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import TeamMemberListingSkeleton from './TeamMemberListingSkeleton';

interface TeamTableProps {
  page: number;
  userTypeCode: string;
  query: string;
  onTotalChange: (total: number) => void;
}

const TeamTable = ({
  page,
  userTypeCode,
  query,
  onTotalChange,
}: TeamTableProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TUser[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await teamListApiCall(page, userTypeCode, query);
        if (!res.success) throw new Error();
        setData(res.data.items);
        setTotalPage(res.data.total_pages);
        onTotalChange(res.data.total);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('API call failed:', error);
        toast.error('Something went wrong!');
      }
    };
    fetchData();
  }, [page, userTypeCode, query, onTotalChange]);

  if (isLoading) return <TeamMemberListingSkeleton />;

  return (
    <div className="flow-root">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
              <tr>
                <th scope="col" className="px-4 py-3">
                  User
                </th>
                <th scope="col" className="px-4 py-3">
                  Role
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-nowrap">
                  Primary Skill
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-nowrap">
                  Last Login
                </th>
                <th scope="col" className="px-4 py-3 text-nowrap">
                  Added On
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
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
              {data.length === 0 && (
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
    </div>
  );
};

export default TeamTable;
