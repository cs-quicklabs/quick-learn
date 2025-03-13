'use client';
import { useEffect, useState } from 'react';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { format } from 'date-fns';
import {
  fetchUnapprovedLessons,
  selectPaginationApprovalList,
  setCurrentPageApprovalList,
} from '@src/store/features/approvalSlice';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  getSystemPreferencesState,
  updateSystemPreferencesData,
} from '@src/store/features/systemPreferenceSlice';
import { SuperLink } from '@src/utils/HiLink';
import { debounce } from '@src/utils/helpers';
import ApprovalListSkeleton from './ApprovalListSkeleton';
import { SystemPreferencesKey } from '@src/shared/types/contentRepository';
import BasicPagination from '@src/shared/components/BasicPagination';

const columns = [
  en.common.lesson,
  en.common.updatedOn,
  en.common.createdOn,
  en.common.createdBy,
];

function ApprovalList() {
  const dispatch = useAppDispatch();
  const { metadata } = useAppSelector(getSystemPreferencesState);
  const unAprrovedDataTotal = metadata[SystemPreferencesKey.UNAPPROVED_LESSONS];

  const { lessons, total, totalPages, isInitialLoad, isLoading, currentPage } =
    useAppSelector(selectPaginationApprovalList);

  const [search, setSearch] = useState('');

  const fetchLessons = (pageNum: number, searchTerm: string) => {
    dispatch(fetchUnapprovedLessons({ page: pageNum, q: searchTerm }));
  };

  const debouncedSearch = debounce((searchTerm: string) => {
    dispatch(setCurrentPageApprovalList(1));
    fetchLessons(1, searchTerm);
  }, 500);

  useEffect(() => {
    fetchLessons(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && search === '' && unAprrovedDataTotal !== total) {
      dispatch(
        updateSystemPreferencesData({
          unapproved_lessons: total,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoading]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    debouncedSearch(searchTerm);
  };

  function renderTableData() {
    if (lessons.length === 0)
      return (
        <tr>
          <td
            colSpan={7}
            className="px-4 py-2 font-medium text-gray-900 text-center"
          >
            {en.common.noResultFound}
          </td>
        </tr>
      );

    return lessons.map((lesson, index) => (
      <tr
        id={`row${index}`}
        key={lesson.id}
        className="border-b border-gray-200 hover:bg-gray-100"
      >
        <th
          scope="row"
          className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
        >
          <div className="flex items-center">
            <SuperLink
              className="ml-2 hover:underline first-letter:uppercase"
              href={`${RouteEnum.APPROVALS}/${lesson.id}`}
            >
              {lesson.name}
            </SuperLink>
          </div>
        </th>
        <td className="px-4 py-2 whitespace-nowrap">
          {format(lesson.updated_at, DateFormats.shortDate)}
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          {format(lesson.created_at, DateFormats.shortDate)}
        </td>
        <td className="px-4 py-2 first-letter:uppercase whitespace-nowrap">
          {lesson.created_by
            ? lesson.created_by_user.first_name +
              ' ' +
              lesson.created_by_user.last_name
            : 'Admin'}
        </td>
      </tr>
    ));
  }

  if (isInitialLoad) return <ApprovalListSkeleton />;

  return (
    <div className="px-4 mx-auto max-w-screen-2xl lg:px-8">
      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-xs">
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
                className="bg-gray-50 w-full sm:w-64 h-[36px] border border-gray-300 focus:ring-1 text-gray-900 text-sm rounded-lg focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 block touch-none px-2"
                placeholder="Search lessons..."
                value={search}
                onChange={handleSearchChange}
                id="search_approval_lesson"
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
            <tbody>{renderTableData()}</tbody>
          </table>
          {isLoading && !isInitialLoad && (
            <div className="fixed top-4 right-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
            </div>
          )}
        </div>
      </div>

      <BasicPagination
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={(pageIndex: number) => {
          const newPage = pageIndex || 1;
          dispatch(setCurrentPageApprovalList(newPage));
          dispatch(fetchUnapprovedLessons({ page: newPage, q: search }));
        }}
      />
    </div>
  );
}

export default ApprovalList;
