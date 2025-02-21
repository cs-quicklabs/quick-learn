'use client';

import { DateFormats } from '@src/constants/dateFormats';
import { RouteEnum } from '@src/constants/route.enum';
import { SuperLink } from '@src/utils/HiLink';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from './Skeleton';
import BasicPagination from '@src/shared/components/BasicPagination';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchOrphanCourses,
  selectPaginationOrphanList,
  setCurrentPageOrphanList,
} from '@src/store/features/orphanCourseSlice';
import { en } from '@src/constants/lang/en';
import { debounce } from '@src/utils/helpers';

const columns = [
  'Courses',
  'Category',
  'Updated On',
  'Created On',
  'Created by',
];

const CourseTable = () => {
  const dispatch = useAppDispatch();
  const { course, total, totalPages, isInitialLoad, currentPage } =
    useAppSelector(selectPaginationOrphanList);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchOrphanCourses({ page: 1, q: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    debouncedSearch(searchTerm);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        dispatch(setCurrentPageOrphanList(1));
        dispatch(fetchOrphanCourses({ page: 1, q: searchTerm }));
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, fetchOrphanCourses],
  );

  const renderTableData = () => {
    return course && course.length > 0 ? (
      <tbody className=" w-full">
        {course.map((course, index) => (
          <tr
            id={`row${index}`}
            key={course.id}
            className="border-b w-full border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <div className="flex items-center">
                <SuperLink
                  className="hover:underline first-letter:uppercase"
                  href={`${RouteEnum.CONTENT}/course/${course.id}`}
                >
                  {course.name}
                </SuperLink>
              </div>
            </th>
            <td className="px-4 py-2 capitalize">
              {course.course_category?.name}
            </td>
            <td className="px-4 py-2">
              {format(course.updated_at, DateFormats.shortDate)}
            </td>
            <td className="px-4 py-2">
              {format(course.created_at, DateFormats.shortDate)}
            </td>
            <td className="px-4 py-2 capitalize">
              {course.created_by?.display_name ?? 'Super Admin'}
            </td>
          </tr>
        ))}
      </tbody>
    ) : (
      <tbody>
        <tr>
          <td
            colSpan={7}
            className="px-4 py-2 font-medium text-gray-900 text-center"
          >
            {en.orphanCourse.noDataFound}
          </td>
        </tr>
      </tbody>
    );
  };

  if (isInitialLoad) return <Skeleton />;

  return (
    <div>
      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div className=" mx-auto max-w-screen-2xl overflow-auto">
          <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h1 className=" text-lg font-semibold">
                {en.orphanCourse.heading}
              </h1>
              <p className="text-gray-500 text-sm">
                {en.orphanCourse.subHeading}
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <input
                type="text"
                className="bg-gray-50 w-full sm:w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                placeholder="Search Courses..."
                value={search}
                onChange={handleSearchChange}
              />
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
                      column === 'Courses' ? 'w-[35%]' : ''
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            {renderTableData()}
          </table>
        </div>
      </div>

      <BasicPagination
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={(pageIndex: number) => {
          const newPage = pageIndex || 1;
          dispatch(setCurrentPageOrphanList(newPage));
          dispatch(fetchOrphanCourses({ page: newPage, q: search }));
        }}
      />
    </div>
  );
};

export default CourseTable;
