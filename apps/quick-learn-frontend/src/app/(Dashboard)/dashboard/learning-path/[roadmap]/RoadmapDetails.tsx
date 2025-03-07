'use client';
import { getLearningPathRoadmap } from '@src/apiServices/learningPathService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import ProgressCard from '@src/shared/components/ProgressCard';
import RoadmapCourseSkeleton from '@src/shared/components/roadmapCourseSkeleton';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TRoadmap, TUserRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchUserProgress,
  selectUserProgress,
  selectUserProgressStatus,
} from '@src/store/features/userProgressSlice';
import { UserLessonProgress } from '@src/shared/types/LessonProgressTypes';
import { getUserProgress } from '@src/apiServices/lessonsService';
import {
  calculateCourseProgress,
  calculateRoadmapProgress,
} from '@src/utils/helpers';
import { selectDashboardData } from '@src/store/features/dashboardSlice';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

function RoadmapDetails() {
  const { member, roadmap } = useParams<{ member: string; roadmap: string }>();
  const baseLink =
    member !== undefined
      ? `${RouteEnum.TEAM}/${member}`
      : RouteEnum.MY_LEARNING_PATH;

  const defaultLinks: TBreadcrumb[] = [
    ...(member !== undefined ? [{ name: 'Team', link: RouteEnum.TEAM }] : []),
    {
      name: member
        ? en.myLearningPath.learning_path
        : en.myLearningPath.heading,
      link: baseLink,
    },
  ];

  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultLinks);
  const [roadmapData, setRoadmapData] = useState<TRoadmap | TUserRoadmap>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [memberUserProgress, setMemberUserProgress] = useState<
    UserLessonProgress[]
  >([]);

  const userProgress = useAppSelector(selectUserProgress);
  const progressStatus = useAppSelector(selectUserProgressStatus);
  const { roadmaps: dashboardRoadmaps } = useAppSelector(selectDashboardData);

  useEffect(() => {
    if (progressStatus === 'idle') {
      dispatch(fetchUserProgress());
    }
  }, [dispatch, progressStatus]);

  useEffect(() => {
    const existingRoadmap = dashboardRoadmaps.find(
      (r) => r.id.toString() === roadmap,
    );

    if (existingRoadmap) {
      setRoadmapData(existingRoadmap);

      // Still fetch fresh data in background
      getLearningPathRoadmap(roadmap, Number(member))
        .then((res) => {
          setRoadmapData(res.data);
          setLinks([
            ...defaultLinks,
            {
              name: res.data.name,
              link: `${baseLink}/${roadmap}`,
            },
          ]);
        })
        .catch((err) => {
          showApiErrorInToast(err);
        });
    } else {
      setIsPageLoading(true);
      getLearningPathRoadmap(roadmap, Number(member))
        .then((res) => {
          setRoadmapData(res.data);
          setLinks([
            ...defaultLinks,
            {
              name: res.data.name,
              link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}`,
            },
          ]);
        })
        .catch((err) => {
          showApiErrorInToast(err);
          router.push(member ? baseLink : RouteEnum.MY_LEARNING_PATH);
        })
        .finally(() => setIsPageLoading(false));
    }
    if (member) {
      getUserProgress(Number(member))
        .then((res) => setMemberUserProgress(res.data))
        .catch((e) => showApiErrorInToast(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap, router, dashboardRoadmaps, member]);

  if (isPageLoading && !roadmapData) {
    return <RoadmapCourseSkeleton />;
  }

  if (!roadmapData) {
    return null;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={headerVariants}>
        <Breadcrumb links={links} />
      </motion.div>

      <motion.div
        className="items-baseline mb-3 md:mb-8"
        variants={headerVariants}
      >
        <h1 className="text-center text-3xl md:text-5xl font-extrabold leading-tight first-letter:uppercase">
          {roadmapData.name}
        </h1>
        <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
          ({roadmapData.courses?.length ?? 0} {en.contentRepository.courses},
          &nbsp;
          {`${calculateRoadmapProgress(
            roadmapData,
            member ? memberUserProgress : userProgress,
          )}% `}
          {en.common.complete})
        </p>
      </motion.div>

      <motion.div
        className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        variants={headerVariants}
      >
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {en.common.myCourses}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {en.common.coursesCount.replace(
              '{count}',
              (roadmapData.courses || []).length.toString(),
            )}
          </p>
        </div>
      </motion.div>

      <div className="relative px-6 grid gap-10 pb-16">
        {!roadmapData.courses?.length ? (
          <EmptyState type="courses" />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {roadmapData.courses.map((course) => {
                const percentage = calculateCourseProgress(
                  course,
                  member ? memberUserProgress : userProgress,
                );

                return (
                  <motion.li
                    key={course.id}
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <ProgressCard
                      id={course.id}
                      name={course.name}
                      className="w-full"
                      title={course.description}
                      link={`${
                        member ? baseLink : RouteEnum.MY_LEARNING_PATH
                      }/${roadmap}/${course.id}`}
                      percentage={percentage}
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default RoadmapDetails;
