'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { en } from '@src/constants/lang/en';
import { DateFormats } from '@src/constants/dateFormats';
import { RouteEnum } from '@src/constants/route.enum';
import { getFlaggedLessons } from '@src/apiServices/lessonsService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import FlaggedListSkeleton from './flaggedSkeleton';
import { TFlaggedLesson } from '@src/shared/types/contentRepository';
import { useAppDispatch } from '@src/store/hooks';
import { updateSystemPreferencesData } from '@src/store/features/systemPreferenceSlice';
import { SuperLink } from '@src/utils/HiLink';

const columns = [
  en.common.lesson,
  en.common.updatedOn,
  en.common.createdOn,
  en.common.flaggedOn,
  en.common.flaggedBy,
];

const ITEMS_PER_PAGE = 10;

const FlaggedList = () => {
  const dispatch = useAppDispatch();
  const [flaggedLessons, setFlaggedLessons] = useState<TFlaggedLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLessons, setTotalLessons] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateSystemPreferencesData({
          flagged_lessons: totalLessons,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Debounce search input to reduce unnecessary API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue]);

  useEffect(() => {
    const fetchFlaggedLessons = async () => {
      setIsLoading(true);
      await getFlaggedLessons(currentPage, ITEMS_PER_PAGE, debouncedSearch)
        .then(({ data }) => {
          setFlaggedLessons(data.items || []);
          setTotalLessons(data.total || 0);
          setTotalPages(data.total_pages || 0);
        })
        .catch((err) => showApiErrorInToast(err))
        .finally(() => {
          setIsLoading(false);
          setIsInitialLoad(false);
        });
    };

    fetchFlaggedLessons();
  }, [currentPage, debouncedSearch]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    try {
      return format(new Date(date), DateFormats.shortDate);
    } catch (error) {
      return '-';
    }
  };

  if (isInitialLoad && isLoading) return <FlaggedListSkeleton />;

  return (
    <div className="px-4 mx-auto max-w-screen-2xl lg:px-8">
      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div className="flex items-center justify-between">
          <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h1 className="mr-3 text-lg font-semibold">
                {en.common.flaggedLessons}
              </h1>
              <p className="text-gray-500 text-sm">{en.common.flaggedDesc}</p>
            </div>
          </div>
          <div className="mr-6">
            <input
              type="text"
              className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
              placeholder="Search Lessons"
              value={searchInputValue}
              onChange={handleSearchChange}
              id="search"
            />
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
                      <SuperLink
                        className="ml-2 hover:underline"
                        href={`${RouteEnum.FLAGGED}/${flaggedLesson.lesson_id}`}
                      >
                        {flaggedLesson.lesson?.name ?? '-'}
                      </SuperLink>
                    </div>
                  </th>
                  <td className="px-4 py-2">
                    {(flaggedLesson?.lesson?.updated_at &&
                      formatDate(flaggedLesson?.lesson?.updated_at)) ||
                      '-'}
                  </td>
                  <td className="px-4 py-2">
                    {(flaggedLesson?.lesson?.created_at &&
                      formatDate(flaggedLesson.lesson.created_at)) ||
                      '-'}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(flaggedLesson.flagged_on)}
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

      {/* Pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between my-5">
        <div>
          <p className="text-sm text-gray-700">
            {en.teams.showing}{' '}
            <span className="font-medium">
              {totalLessons === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            {en.teams.to}{' '}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, totalLessons)}
            </span>{' '}
            {en.teams.of} <span className="font-medium">{totalLessons}</span>{' '}
            {en.teams.results}
          </p>
        </div>
        <div>
          <div className="flex">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowLeftIcon height={20} width={32} /> {en.teams.previous}
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                {en.teams.next}
                <ArrowRightIcon height={20} width={32} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlaggedList;
