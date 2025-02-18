'use client';
import { DateFormats } from '@src/constants/dateFormats';
import { RouteEnum } from '@src/constants/route.enum';
import { TCourse } from '@src/shared/types/contentRepository';
import {
  selectContentRepositoryCourseCategory,
  selectIsMetadataInitialized,
} from '@src/store/features';
import { useAppSelector } from '@src/store/hooks';
import { SuperLink } from '@src/utils/HiLink';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Skeleton from './Skeleton';

const columns = ['Courses', 'Updated On', 'Created On', 'Created by'];

const CourseTable = () => {
  const isInitialsed = useAppSelector(selectIsMetadataInitialized);
  const course_categories = useAppSelector(
    selectContentRepositoryCourseCategory,
  );
  console.log(isInitialsed);
  const [orphanCourse, setOrphanCourse] = useState<TCourse[]>([]);

  // filter out the courses
  const filterOrphanCourse = () => {
    console.log(course_categories);

    if (!course_categories) return;
    const allCourses = course_categories.flatMap(
      (category) => category.courses,
    );
    const orphanCourse = allCourses.filter(
      (course) => course.roadmaps_count === 0,
    );
    console.log(orphanCourse);
    setOrphanCourse(orphanCourse);
  };

  const renderTableData = () => {
    return orphanCourse && orphanCourse.length > 0 ? (
      orphanCourse.map((course, index) => (
        <tr
          id={`row${index}`}
          key={course.id}
          className="border-b w-full border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td
            scope="row"
            className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            <div className="flex items-center">
              <SuperLink
                className="ml-2 hover:underline"
                href={`${RouteEnum.CONTENT}/course/${course.id}`}
              >
                {course.name}
              </SuperLink>
            </div>
          </td>
          <td className="px-4 py-2">
            {format(course.updated_at, DateFormats.shortDate)}
          </td>
          <td className="px-4 py-2">
            {format(course.created_at, DateFormats.shortDate)}
          </td>
          <td className="px-4 py-2">{course.created_by_user_id}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan={7}
          className="px-4 py-2 font-medium text-gray-900 text-center"
        >
          no data found
        </td>
      </tr>
    );
  };

  useEffect(() => {
    filterOrphanCourse();
  }, [course_categories]);

  if (!isInitialsed) return <Skeleton />;

  return (
    <div className="">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className={`px-4 py-3 ${column === 'Courses' ? 'w-[45%]' : ''}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default CourseTable;
