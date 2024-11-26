'use client';
import React, { useEffect } from 'react';
import ProgressCard from '@src/shared/components/ProgressCard';
import { en } from '@src/constants/lang/en';
import DashboardSkeleton from './components/DashboardSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { RouteEnum } from '@src/constants/route.enum';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchUserContent,
  selectIsLearningPathInitialized,
  selectLearningPathStatus,
  selectUserCourses,
  selectUserRoadmaps,
} from '@src/store/features/learningPathSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const roadmaps = useAppSelector(selectUserRoadmaps);
  const courses = useAppSelector(selectUserCourses);
  const status = useAppSelector(selectLearningPathStatus);
  const isInitialized = useAppSelector(selectIsLearningPathInitialized);

  const isLoading = !isInitialized && status === 'loading';

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchUserContent());
    }
  }, [dispatch, isInitialized]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const renderRoadmapsSection = () => (
    <>
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.common.myRoadmaps}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {en.common.roadmapsCount.replace(
              '{count}',
              roadmaps.length.toString(),
            )}
          </p>
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-4">
        {roadmaps.length === 0 ? (
          <EmptyState type="roadmaps" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {roadmaps.map((roadmap) => (
                <ProgressCard
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow group duration-200 text-left h-40"
                  key={roadmap.id}
                  id={roadmap.id}
                  name={roadmap.name}
                  title={roadmap.description}
                  link={`${RouteEnum.MY_LEARNING_PATH}/${roadmap.id}`}
                  // percentage={roadmap.percentage || 0}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );

  const renderCoursesSection = () => (
    <>
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.common.myCourses}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {en.common.coursesCount.replace(
              '{count}',
              courses.length.toString(),
            )}
          </p>
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-16">
        {courses.length === 0 ? (
          <EmptyState type="courses" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {courses.map((course) => (
                <ProgressCard
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow group duration-200 text-left h-40"
                  key={course.id}
                  id={course.id}
                  name={course.name}
                  title={course.description}
                  link={`${RouteEnum.MY_LEARNING_PATH}/courses/${course.id}`}
                  // percentage={course.percentage || 0}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-gray-50 relative z-0 flex-1 min-h-0 focus:outline-none">
      {renderRoadmapsSection()}
      {renderCoursesSection()}
    </div>
  );
};

export default Dashboard;
