'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { en } from '@src/constants/lang/en';
import { DateFormats } from '@src/constants/dateFormats';
import { RouteEnum } from '@src/constants/route.enum';
import FlaggedListSkeleton from './flaggedSkeleton';
import { SystemPreferencesKey } from '@src/shared/types/contentRepository';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  getSystemPreferencesState,
  updateSystemPreferencesData,
} from '@src/store/features/systemPreferenceSlice';
import { SuperLink } from '@src/utils/HiLink';
import {
  fetchFlaggedLessons,
  selectPaginationFlaggedList,
  setCurrentPageFlaggedList,
} from '@src/store/features';
import { debounce } from '@src/utils/helpers';
import BasicPagination from '@src/shared/components/BasicPagination';

const columns = [
  en.common.lesson,
  en.common.updatedOn,
  en.common.createdOn,
  en.common.flaggedOn,
  en.common.flaggedBy,
];

function FlaggedList() {
  const dispatch = useAppDispatch();
  const { metadata } = useAppSelector(getSystemPreferencesState);
  const flaggedTotal = metadata[SystemPreferencesKey.FLAGGED_LESSONS];
  const { lessons, total, totalPages, isInitialLoad, isLoading, currentPage } =
    useAppSelector(selectPaginationFlaggedList);

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isLoading && search === '' && flaggedTotal !== total) {
      dispatch(
        updateSystemPreferencesData({
          flagged_lessons: total,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchLessons = useCallback(
    (pageNum: number, searchTerm: string) => {
      dispatch(fetchFlaggedLessons({ page: pageNum, q: searchTerm }));
    },
    [dispatch],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        dispatch(setCurrentPageFlaggedList(1));
        fetchLessons(1, searchTerm);
      }, 500),
    [dispatch, fetchLessons],
  );

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    try {
      return format(new Date(date), DateFormats.shortDate);
    } catch (error) {
      console.warn(error);
      return '-';
    }
  };

  useEffect(() => {
    fetchLessons(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    debouncedSearch(searchTerm);
  };

  if (isInitialLoad) return <FlaggedListSkeleton />;

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

            <div className="w-full sm:w-auto">
              <input
                type="text"
                className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block touch-none"
                placeholder="Search Lessons"
                value={search}
                onChange={handleSearchChange}
                id="search"
              />
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
              {lessons.map((flaggedLesson, index) => (
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
                        className="ml-2 hover:underline first-letter:uppercase"
                        href={`${RouteEnum.FLAGGED}/${flaggedLesson.lesson_id}`}
                      >
                        {flaggedLesson.lesson?.name ?? '-'}
                      </SuperLink>
                    </div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {(flaggedLesson?.lesson?.updated_at &&
                      formatDate(flaggedLesson?.lesson?.updated_at)) ||
                      '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {(flaggedLesson?.lesson?.created_at &&
                      formatDate(flaggedLesson.lesson.created_at)) ||
                      '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatDate(flaggedLesson.flagged_on)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {flaggedLesson.user
                      ? `${flaggedLesson.user.first_name} ${flaggedLesson.user.last_name}`
                      : en.common.unknown}
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && !isLoading && (
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
        </div>
      )}

      <BasicPagination
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={(index: number) => {
          const newPage = index || 1;
          dispatch(setCurrentPageFlaggedList(newPage));
          dispatch(fetchFlaggedLessons({ page: newPage, q: search }));
        }}
      />
    </div>
  );
}

export default FlaggedList;
