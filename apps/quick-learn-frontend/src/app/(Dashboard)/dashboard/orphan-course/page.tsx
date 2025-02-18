import { en } from '@src/constants/lang/en';
import React from 'react';
import CourseTable from './CourseTable';

const page = () => {
  return (
    <div className="px-4 mx-auto max-w-screen-2xl lg:px-8">
      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
        <div>
          <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h1 className="mr-3 text-lg font-semibold">
                {en.orphanCourse.heading}
              </h1>
              <p className="text-gray-500 text-sm">
                {en.orphanCourse.subHeading}
              </p>
            </div>
          </div>
        </div>
        <CourseTable />
      </div>
    </div>
  );
};

export default page;
