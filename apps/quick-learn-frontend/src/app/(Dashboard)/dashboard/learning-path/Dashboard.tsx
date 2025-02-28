'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProgressCard from '@src/shared/components/ProgressCard';
import { en } from '@src/constants/lang/en';
import DashboardSkeleton from './components/DashboardSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { RouteEnum } from '@src/constants/route.enum';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchDashboardData,
  selectDashboardData,
} from '@src/store/features/dashboardSlice';
import {
  fetchUserProgress,
  selectUserProgress,
} from '@src/store/features/userProgressSlice';
import {
  calculateRoadmapProgress,
  calculateCourseProgress,
} from '@src/utils/helpers';
import SmallScreenTabs from '@src/shared/components/SmallScreenTabs';

const AnimatedProgressCard = motion.create(ProgressCard);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState('roadmaps');
  const dispatch = useAppDispatch();

  // Only select from store if it's ready
  const { roadmaps, courses, status, isInitialized } =
    useAppSelector(selectDashboardData);

  const userProgress = useAppSelector(selectUserProgress);

  // Only fetch data if store is ready
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchUserProgress());
  }, [dispatch]);

  if (!isInitialized || status === 'loading') {
    return <DashboardSkeleton />;
  }

  const tabs = [
    { id: 'roadmaps', label: en.common.myRoadmaps, count: roadmaps.length },
    { id: 'courses', label: en.common.myCourses, count: courses.length }
  ];

  const renderRoadmapsSection = () => (
    <div className={`${activeTab === 'courses' ? 'hidden md:block' : 'block'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-8 py-8 hidden md:flex md::items-center md:justify-between sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {en.common.myRoadmaps}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {roadmaps.length > 1
              ? en.common.roadmapsCount.replace(
                  '{count}',
                  roadmaps?.length?.toString() || '0',
                )
              : en.common.roadmapCount.replace(
                  '{count}',
                  roadmaps?.length?.toString() || '0',
                )}
          </p>
        </div>
      </motion.div>

      <div className="relative px-6 grid gap-10 pb-4">
        {!Array.isArray(roadmaps) || roadmaps.length === 0 ? (
          <EmptyState type="roadmaps" />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {roadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap?.id || `fallback-key-${index}`}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatedProgressCard
                    className="hover:shadow-lg w-full cursor-pointer transition-all duration-200 text-left transform"
                    id={roadmap?.id}
                    name={roadmap?.name || ''}
                    title={roadmap?.description || ''}
                    link={`${RouteEnum.MY_LEARNING_PATH}/${roadmap?.id}`}
                    percentage={calculateRoadmapProgress(roadmap, userProgress)}
                  />
                </motion.div>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderCoursesSection = () => (
    <div
      className={`${activeTab === 'roadmaps' ? 'hidden md:block' : 'block'}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-8 py-8 hidden md:flex md:items-center md:justify-between sm:px-6 lg:px-8"
      >
        <div className="hidden md:flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {en.common.myCourses}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {courses.length > 1
              ? en.common.coursesCount.replace(
                  '{count}',
                  courses?.length?.toString() || '0',
                )
              : en.common.courseCount.replace(
                  '{count}',
                  courses?.length?.toString() || '0',
                )}
          </p>
        </div>
      </motion.div>

      <div className="relative px-6 grid gap-10 pb-16">
        {!Array.isArray(courses) || courses.length === 0 ? (
          <EmptyState type="courses" />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {courses.map((course, index) => {
                if (!course) return null;

                return (
                  <motion.div
                    key={course.id || `fallback-key-${index}`}
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatedProgressCard
                      className=" hover:shadow-lg cursor-pointer w-full transition-all duration-200 text-left transform"
                      id={course.id}
                      name={course.name || ''}
                      title={course.description || ''}
                      link={`${RouteEnum.MY_LEARNING_PATH}/courses/${course.id}`}
                      percentage={calculateCourseProgress(course, userProgress)}
                    />
                  </motion.div>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 relative z-0 flex-1 min-h-0 focus:outline-none"
    >

      <div className=" mt-[85px] mb-5 mx-6"> 
      <SmallScreenTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />
      </div>
      {renderRoadmapsSection()}
      {renderCoursesSection()}
    </motion.div>
  );
}

export default Dashboard;