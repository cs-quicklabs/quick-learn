'use client';
import { getUnapprovedLessons } from '@src/apiServices/lessonsService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { TLesson } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ApprovalListSkeleton from './ApprovalListSkeleton';

const columns = [
  en.common.lesson,
  en.common.updatedOn,
  en.common.createdOn,
  en.common.createdBy,
];

const ApprovalList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TLesson[]>([]);

  useEffect(() => {
    setLoading(true);
    getUnapprovedLessons()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <ApprovalListSkeleton />;
  return (
    <div className="px-4 mx-auto max-w-screen-2xl lg:px-8">
      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div>
          <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h1 className="mr-3 text-lg font-semibold">
                {en.approvals.lessonsApprovals}
              </h1>
              <p className="text-gray-500 text-sm">{en.approvals.subHeading}</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className={`px-4 py-3 ${
                      column === en.common.lesson ? 'w-[45%]' : ''
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((lesson, index) => (
                <tr
                  id={`row${index}`}
                  key={lesson.id}
                  className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center">
                      <Link
                        className="ml-2 hover:underline"
                        href={`${RouteEnum.APPROVALS}/${lesson.id}`}
                      >
                        {lesson.name}
                      </Link>
                    </div>
                  </th>
                  <td className="px-4 py-2">
                    {format(lesson.updated_at, DateFormats.shortDate)}
                  </td>
                  <td className="px-4 py-2">
                    {format(lesson.created_at, DateFormats.shortDate)}
                  </td>
                  <td className="px-4 py-2">
                    {lesson.created_by_user.first_name +
                      ' ' +
                      lesson.created_by_user.last_name || '-'}
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

export default ApprovalList;
