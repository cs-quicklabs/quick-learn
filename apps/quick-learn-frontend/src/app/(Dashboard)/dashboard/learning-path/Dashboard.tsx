'use client';
import React, { useEffect, useState } from 'react';
import ProgressCard from '@src/shared/components/ProgressCard';
import { TUserCourse, TUserRoadmap } from '@src/shared/types/contentRepository';
import { getUserRoadmapsService } from '@src/apiServices/contentRepositoryService';
import { en } from '@src/constants/lang/en';
import DashboardSkeleton from './components/DashboardSkeleton';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmaps, setRoadmaps] = useState<TUserRoadmap[]>([]);
  const [courses, setCourses] = useState<TUserCourse[]>([]);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        setIsLoading(true);
        const response = await getUserRoadmapsService();
        if (response.success) {
          const userRoadmaps = response.data;
          setRoadmaps(userRoadmaps);
          const allCourses = userRoadmaps.reduce<TUserCourse[]>(
            (acc, roadmap) => {
              if (roadmap.courses) {
                return [...acc, ...roadmap.courses];
              }
              return acc;
            },
            [],
          );
          const uniqueCourses = Array.from(
            new Map(allCourses.map((course) => [course.id, course])).values(),
          );
          setCourses(uniqueCourses);
        }
      } catch (err) {
        setError(en.common.somethingWentWrong);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserContent();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 relative z-0 flex-1 overflow-x-scroll focus:outline-none h-screen">
      {/* Roadmaps Section */}
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.common.myRoadmaps}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            ({roadmaps.length} {en.common.roadmaps})
          </p>
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-4">
        <div>
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8"
          >
            {roadmaps.map((roadmap) => (
              <ProgressCard
                key={roadmap.id}
                id={roadmap.id}
                name={roadmap.name}
                title={roadmap.description}
                // percentage={roadmap.percentage || 0}
                type="roadmap"
              />
            ))}
          </ul>
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.common.myCourses}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            ({courses.length} {en.common.courses})
          </p>
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-16">
        <div>
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8"
          >
            {courses.map((course) => (
              <ProgressCard
                key={course.id}
                id={course.id}
                name={course.name}
                title={course.description}
                // percentage={course.percentage || 0}
                type="course"
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
