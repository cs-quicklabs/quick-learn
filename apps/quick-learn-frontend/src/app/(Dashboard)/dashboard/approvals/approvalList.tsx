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
    <>
      <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <div>
            <h1 className="mr-3 text-lg font-semibold">
              {en.approvals.lessonsApprovals}
            </h1>
            <p className="text-gray-500 text-sm">{en.approvals.subHeading}</p>
          </div>
        </div>
        <div className="flow-root">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} scope="col" className="px-4 py-3">
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
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap capitalize">
                        <Link
                          className="hover:underline"
                          href={`${RouteEnum.APPROVALS}/${lesson.id}`}
                        >
                          {lesson.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-500 whitespace-nowrap capitalize">
                        {format(lesson.updated_at, DateFormats.shortDate)}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-500 whitespace-nowrap capitalize">
                        {format(lesson.created_at, DateFormats.shortDate)}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-500 whitespace-nowrap capitalize">
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
      </section>
    </>
  );
};

export default ApprovalList;
