'use client';
import { RouteEnum } from '@src/constants/route.enum';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { TUser, TUserType } from '@src/shared/types/userTypes';
import { userApiEnum } from '@src/constants/api.enum';
import axiosInstance from '@src/apiServices/axios';
import { DateFormats } from '@src/constants/dateFormats';

const TeamMemberListing = () => {
  const [data, setData] = useState<TUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [userTypeCode, setUserTypeCode] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const route = `${userApiEnum.GET_USER_LIST}${
          userTypeCode ? '?user_type_code=' + userTypeCode : ''
        }`;
        const res = (await axiosInstance.post(route, {
          mode: 'paginate',
          page: page,
        })) as unknown as {
          success: boolean;
          data: {
            items: TUser[];
            limit: number;
            page: number;
            total: number;
            total_pages: number;
          };
        };
        setData(res.data.items);
        setTotal(res.data.total);
        setTotalPage(res.data.total_pages);
        if (!res.success) throw new Error();
      } catch (error) {
        console.error('API call failed:', error);
        toast.error('Something went wrong!');
      }
    };
    fetchData();
  }, [page, userTypeCode]);

  const userTypes: TUserType[] = [
    { name: 'Admin', code: 'admin' },
    { name: 'Editors', code: 'editor' },
    { name: 'Members', code: 'member' },
  ];

  function filterByUserType(code: string) {
    setUserTypeCode(code);
    setPage(1);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <div>
            <h1 className="mr-3 text-lg font-semibold">Team</h1>
            <p className="text-gray-500 text-sm">
              Manage all your existing <span className="font-bond">4</span> team
              members or add a new one.
            </p>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              className="bg-gray-50 w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              placeholder="Search Members"
            />
            <Link
              href={`${RouteEnum.TEAM}/add`}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-2 focus:ring-primary-300 focus:outline-none"
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
                  onClick={() => filterByUserType(userType.code)}
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
              className="underline font-medium text-blue-600 dark:text-blue-500 hover:underline text-sm"
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
                    <th scope="col" className="px-4 py-3">
                      Primary Skill
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Last Login
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Added On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-400 hover:bg-gray-100"
                    >
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                        <Link href={`${RouteEnum.TEAM}/${user.uuid}`}>
                          {user.first_name} {user.last_name}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        <div className="inline-flex items-center bg-slate-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                          <svg
                            className="text-gray-800 h-3.5 w-3.5 mr-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{user.user_type.name || 'Role'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.skill.name}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                        <div className="inline-flex items-center">
                          <div
                            className={`w-3 h-3 mr-2 border border-gray-200 rounded-full ${
                              user.active == true
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          ></div>
                          {user.active == true ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {(user.last_login_timestamp &&
                          format(user.created_at, DateFormats.shortDate)) ||
                          'Not logged in.'}
                      </td>
                      <td className="px-4 py-2">
                        {format(user.created_at, DateFormats.shortDate)}
                      </td>
                    </tr>
                  ))}
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
              {page > 1 ? (page - 1) * 10 + 1 : 1}
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
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <ArrowLeftIcon height={20} width={32} />
              Previous
            </button>
            <button
              onClick={() => page < totalPage && setPage(page + 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
              <ArrowRightIcon height={20} width={32} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMemberListing;
