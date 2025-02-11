'use client';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import ApprovalListSkeleton from './ApprovalListSkeleton';
import {
  fetchUnapprovedLessons,
  getApprovalLessionListLoading,
  getApprovalLessionList,
  getApprovalLessionListInitialLoad,
} from '@src/store/features/approvalSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { updateSystemPreferencesData } from '@src/store/features/systemPreferenceSlice';
import { SuperLink } from '@src/utils/HiLink';
import { RootState } from '@src/store/store';
import { debounce } from '@src/utils/helpers';

const columns = [
  en.common.lesson,
  en.common.updatedOn,
  en.common.createdOn,
  en.common.createdBy,
];

function ApprovalList() {
  const dispatch = useAppDispatch();
  const lessons = useAppSelector(getApprovalLessionList);
  const isLoading = useAppSelector(getApprovalLessionListLoading);
  const isInitialLoad = useAppSelector(getApprovalLessionListInitialLoad);
  const { page, totalPages, total } = useAppSelector(
    (state: RootState) => state.approval,
  );
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchLessons = (pageNum: number, searchTerm: string) => {
    dispatch(fetchUnapprovedLessons({ page: pageNum, limit, q: searchTerm }));
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => fetchLessons(1, searchTerm), 300),
    [fetchLessons],
  );

  useEffect(() => {
    fetchLessons(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateSystemPreferencesData({
          unapproved_lessons: total,
        }),
      );
    }
  }, [dispatch, isLoading, total]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !isLoading) {
          fetchLessons(page + 1, search);
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, totalPages, limit, isLoading, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    debouncedSearch(searchTerm);
  };

  if (isInitialLoad && isLoading) return <ApprovalListSkeleton />;

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
            <div className="w-full sm:w-auto">
              <input
                type="text"
                className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                placeholder="Search lessons..."
                value={search}
                onChange={handleSearchChange}
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
                      column === en.common.lesson ? 'w-[45%]' : ''
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
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
                      <SuperLink
                        className="ml-2 hover:underline"
                        href={`${RouteEnum.APPROVALS}/${lesson.id}`}
                      >
                        {lesson.name}
                      </SuperLink>
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
              {lessons.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-2 font-medium text-gray-900 text-center"
                  >
                    {search ? en.common.noResultFound : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div ref={observerRef} className="h-10" />
      {isLoading && !isInitialLoad && (
        <div className="fixed top-4 right-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
        </div>
      )}
    </div>
  );
}

export default ApprovalList;
