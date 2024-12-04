'use client';
import React, { useEffect, useState } from 'react';
import ProgressCard from '@src/shared/components/ProgressCard';
import { en } from '@src/constants/lang/en';
import DashboardSkeleton from './components/DashboardSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { RouteEnum } from '@src/constants/route.enum';
import { TUserRoadmap, TUserCourse } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchUserProgress,
  selectUserProgress,
} from '@src/store/features/userProgressSlice';
import { getUserRoadmapsService } from '@src/apiServices/contentRepositoryService';

interface DashboardState {
  roadmaps: TUserRoadmap[];
  courses: TUserCourse[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
}

const initialState: DashboardState = {
  roadmaps: [],
  courses: [],
  status: 'idle',
  error: null,
  isInitialized: false,
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<DashboardState>(initialState);
  const userProgress = useAppSelector(selectUserProgress);

  const extractUniqueCourses = (roadmaps: TUserRoadmap[]): TUserCourse[] => {
    const allCourses = roadmaps.reduce<TUserCourse[]>((acc, roadmap) => {
      if (roadmap.courses) {
        return [...acc, ...roadmap.courses];
      }
      return acc;
    }, []);

    return Array.from(
      new Map(allCourses.map((course) => [course.id, course])).values(),
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!state.isInitialized) {
        setState((prev) => ({ ...prev, status: 'loading' }));
      }

      try {
        // Fetch both roadmaps and progress data
        const [response] = await Promise.all([
          getUserRoadmapsService().catch((error: AxiosErrorObject) => {
            showApiErrorInToast(error);
            throw error;
          }),
          dispatch(fetchUserProgress()),
        ]);

        if (!response.success) {
          throw new Error('Failed to fetch user content');
        }

        const userRoadmaps = response.data;
        const uniqueCourses = extractUniqueCourses(userRoadmaps);

        setState({
          roadmaps: userRoadmaps,
          courses: uniqueCourses,
          status: 'succeeded',
          error: null,
          isInitialized: true,
        });
      } catch (error) {
        if (!state.isInitialized) {
          setState((prev) => ({
            ...prev,
            status: 'failed',
            error: error instanceof Error ? error.message : 'An error occurred',
          }));
        }
      }
    };

    fetchData();
  }, [dispatch]);

  const calculateRoadmapProgress = (roadmap: TUserRoadmap) => {
    if (!roadmap || !Array.isArray(roadmap.courses)) return 0;

    const totalLessonsInRoadmap = roadmap.courses.reduce((total, course) => {
      if (!course) return total;
      return (
        total +
        (Array.isArray(course.lesson_ids) ? course.lesson_ids.length : 0)
      );
    }, 0);

    if (totalLessonsInRoadmap === 0) return 0;

    const completedLessonsInRoadmap = roadmap.courses.reduce(
      (total, course) => {
        if (!course) return total;

        const courseProgress = userProgress?.find(
          (progress) => progress.course_id === course.id,
        );

        const completedLessonIds =
          courseProgress?.lessons?.map((lesson) => lesson.lesson_id) || [];

        const completedCount = Array.isArray(course.lesson_ids)
          ? course.lesson_ids.filter((id) => completedLessonIds.includes(id))
              .length
          : 0;

        return total + completedCount;
      },
      0,
    );

    return Math.round(
      (completedLessonsInRoadmap / totalLessonsInRoadmap) * 100,
    );
  };

  const calculateCourseProgress = (course: TUserCourse) => {
    if (!course || !Array.isArray(course.lesson_ids)) return 0;

    const courseProgress = userProgress?.find(
      (progress) => progress.course_id === course.id,
    );

    const completedLessonIds =
      courseProgress?.lessons?.map((lesson) => lesson.lesson_id) || [];

    const totalLessons = course.lesson_ids.length;
    const completedCount = course.lesson_ids.filter((id) =>
      completedLessonIds.includes(id),
    ).length;

    return totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;
  };

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
              state.roadmaps?.length?.toString() || '0',
            )}
          </p>
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-4">
        {!Array.isArray(state.roadmaps) || state.roadmaps.length === 0 ? (
          <EmptyState type="roadmaps" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {state.roadmaps.map((roadmap) => (
                <ProgressCard
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow group duration-200 text-left"
                  key={roadmap?.id || 'fallback-key'}
                  id={roadmap?.id}
                  name={roadmap?.name || ''}
                  title={roadmap?.description || ''}
                  link={`${RouteEnum.MY_LEARNING_PATH}/${roadmap?.id}`}
                  percentage={calculateRoadmapProgress(roadmap)}
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
              state.courses?.length?.toString() || '0',
            )}
          </p>
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-16">
        {!Array.isArray(state.courses) || state.courses.length === 0 ? (
          <EmptyState type="courses" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {state.courses.map((course) => {
                if (!course) return null;

                return (
                  <ProgressCard
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-shadow group duration-200 text-left"
                    key={course.id || 'fallback-key'}
                    id={course.id}
                    name={course.name || ''}
                    title={course.description || ''}
                    link={`${RouteEnum.MY_LEARNING_PATH}/courses/${course.id}`}
                    percentage={calculateCourseProgress(course)}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );

  if (!state.isInitialized && state.status === 'loading') {
    return <DashboardSkeleton />;
  }

  return (
    <div className="bg-gray-50 relative z-0 flex-1 min-h-0 focus:outline-none">
      {renderRoadmapsSection()}
      {renderCoursesSection()}
    </div>
  );
};

export default Dashboard;
