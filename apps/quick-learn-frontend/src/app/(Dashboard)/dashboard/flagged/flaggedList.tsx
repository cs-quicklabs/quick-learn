'use client';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FlaggedListSkeleton from './flaggedSkeleton';
import { getFlaggedLessons } from '@src/apiServices/lessonsService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';

interface FlaggedLesson {
  id: number;
  flagged_On: string;
  updated_at: string;
  created_at: string;
  course_id: string;
  lesson_id: string;
  lesson: {
    name: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    first_name: string;
    last_name: string;
  };
}

const columns = [
  en.common.lesson,
  en.common.updatedOn,
  en.common.createdOn,
  en.common.flaggedOn,
  en.common.flaggedBy,
];

const FlaggedList = () => {
  const [flaggedLessons, setFlaggedLessons] = useState<FlaggedLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchFlaggedLessons = async () => {
      try {
        setIsLoading(true);
        const response = await getFlaggedLessons();

        if (response && response?.data) {
          setFlaggedLessons(response.data);
        } else {
          setFlaggedLessons([]);
        }
      } catch (error) {
        showApiErrorInToast(error as AxiosErrorObject);
        setFlaggedLessons([]);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchFlaggedLessons();
  }, []);
  if (isInitialLoad && isLoading) return <FlaggedListSkeleton />;

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    try {
      return format(new Date(date), DateFormats.shortDate);
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="px-4 mx-auto max-w-screen-2xl lg:px-8">
      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div>
          <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h1 className="mr-3 text-lg font-semibold">
                {en.common.flaggedLessons}
              </h1>
              <p className="text-gray-500 text-sm">{en.common.flaggedDesc}</p>
            </div>
          </div>
        </div>
        <div className={`overflow-x-auto ${isLoading ? 'opacity-60' : ''}`}>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className={`px-4 py-3 ${
                      column === en.common.lesson ? 'w-[35%]' : ''
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flaggedLessons.map((flaggedLesson, index) => (
                <tr
                  id={`row${index}`}
                  key={flaggedLesson.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <div className="flex items-center">
                      <Link
                        className="ml-2 hover:underline"
                        href={`${RouteEnum.CONTENT}/course/${flaggedLesson.course_id}/${flaggedLesson.lesson_id}`}
                      >
                        {flaggedLesson.lesson?.name || '-'}
                      </Link>
                    </div>
                  </th>
                  <td className="px-4 py-2">
                    {formatDate(flaggedLesson.updated_at)}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(flaggedLesson.created_at)}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(flaggedLesson.flagged_On)}
                  </td>
                  <td className="px-4 py-2">
                    {flaggedLesson.user
                      ? `${flaggedLesson.user.first_name} ${flaggedLesson.user.last_name}`
                      : '-'}
                  </td>
                </tr>
              ))}
              {flaggedLessons.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={columns.length}
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
      {isLoading && !isInitialLoad && (
        <div className="fixed top-4 right-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
        </div>
      )}
    </div>
  );
};

export default FlaggedList;
