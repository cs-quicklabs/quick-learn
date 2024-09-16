'use client';
import { RouteEnum } from '@src/constants/route.enum';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { TUser, TUserType } from '@src/shared/types/userTypes';
import { DateFormats } from '@src/constants/dateFormats';
import { teamListApiCall } from '@src/apiServices/teamService';
import { debounce } from '@src/utils/helpers';
import {
  CustomClipBoardIcon,
  FullPageLoader,
} from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';

const TeamMemberListing = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [data, setData] = useState<TUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [userTypeCode, setUserTypeCode] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      try {
        const res = await teamListApiCall(page, userTypeCode, query);
        if (!res.success) throw new Error();
        setData(res.data.items);
        setTotal(res.data.total);
        setTotalPage(res.data.total_pages);
        setIsPageLoading(false);
      } catch (error) {
        setIsPageLoading(false);
        console.error('API call failed:', error);
        toast.error('Something went wrong!');
      }
    };
    fetchData();
  }, [page, userTypeCode, query]);

  const userTypes: TUserType[] = [
    { name: 'Admin', code: 'admin' },
    { name: 'Editors', code: 'editor' },
    { name: 'Members', code: 'member' },
  ];

  function filterByUserType(code: string) {
    setUserTypeCode(code);
    setPage(1);
  }

  const handleQueryChange = useMemo(
    () =>
      debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const _value = (e.target as HTMLInputElement).value || '';
        try {
          setQuery(_value);
          setPage(1);
        } catch (err) {
          console.log('Something went wrong!', err);
        }
      }, 300),
    [],
  );

  return (
    <>
      {isPageLoading && <FullPageLoader />}
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
              onChange={handleQueryChange}
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
                      <td className="px-4 py-2 capitalize">
                        {user.skill.name}
                      </td>
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
            {page > 1 && page <= totalPage && (
              <button
                id="prev"
                onClick={() => page > 1 && setPage(page - 1)}
                className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowLeftIcon height={20} width={32} />
                Previous
              </button>
            )}
            {page < totalPage && (
              <button
                id="next"
                onClick={() => page < totalPage && setPage(page + 1)}
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
