'use client';
import { getLearningPathRoadmap } from '@src/apiServices/learningPathService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import ProgressCard from '@src/shared/components/ProgressCard';
import RoadmapCourseSkeleton from '@src/shared/components/roadmapCourseSkeleton';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import {
  TCourse,
  TUserCourse,
  TUserRoadmap,
} from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchUserProgress,
  selectUserProgress,
  selectUserProgressStatus,
} from '@src/store/features/userProgressSlice';
import { selectDashboardData } from '@src/store/features/dashboardSlice';
import { motion } from 'framer-motion';

const defaultlinks: TBreadcrumb[] = [
  { name: en.myLearningPath.heading, link: RouteEnum.MY_LEARNING_PATH },
];

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

const RoadmapDetails = () => {
  const { roadmap } = useParams<{ roadmap: string }>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [roadmapData, setRoadmapData] = useState<TUserRoadmap>();
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      setLinks([
        ...defaultlinks,
        {
          name: existingRoadmap.name,
          link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}`,
        },
      ]);
      // Still fetch fresh data in background
      getLearningPathRoadmap(roadmap)
        .then((res) => {
          setRoadmapData(res.data);
        })
        .catch((err) => {
          showApiErrorInToast(err);
        });
    } else {
      setIsPageLoading(true);
      getLearningPathRoadmap(roadmap)
        .then((res) => {
          setRoadmapData(res.data);
          setLinks([
            ...defaultlinks,
            {
              name: res.data.name,
              link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}`,
            },
          ]);
        })
        .catch((err) => {
          showApiErrorInToast(err);
          router.push(RouteEnum.MY_LEARNING_PATH);
        })
        .finally(() => setIsPageLoading(false));
    }
  }, [roadmap, router, dashboardRoadmaps]);

  const calculateCourseProgress = (course: TCourse | TUserCourse) => {
    if (!course?.lesson_ids?.length) return 0;

    const courseProgress = userProgress?.find(
      (progress) => progress.course_id === Number(course.id),
    );

    if (!courseProgress?.lessons?.length) return 0;

    const completedLessonIds = courseProgress.lessons.map(
      (lesson) => lesson.lesson_id,
    );

    const totalLessons = course.lesson_ids.length;
    const completedCount = course.lesson_ids.filter((id) =>
      completedLessonIds.includes(id),
    ).length;

    return Math.round((completedCount / totalLessons) * 100);
  };

  const calculateRoadmapProgress = () => {
    if (!roadmapData?.courses?.length) return 0;

    const totalLessonsInRoadmap = roadmapData.courses.reduce(
      (total, course) => {
        return total + (course.lesson_ids?.length || 0);
      },
      0,
    );

    if (totalLessonsInRoadmap === 0) return 0;

    const completedLessonsInRoadmap = roadmapData.courses.reduce(
      (total, course) => {
        const courseProgress = userProgress?.find(
          (progress) => progress.course_id === Number(course.id),
        );

        const completedLessonIds =
          courseProgress?.lessons?.map((lesson) => lesson.lesson_id) || [];
        const completedCount =
          course.lesson_ids?.filter((id) => completedLessonIds.includes(id))
            .length || 0;

        return total + completedCount;
      },
      0,
    );

    return Math.round(
      (completedLessonsInRoadmap / totalLessonsInRoadmap) * 100,
    );
  };

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

      <motion.div className="items-baseline mb-8" variants={headerVariants}>
        <h1 className="text-center text-5xl font-extrabold leading-tight capitalize">
          {roadmapData.name}
        </h1>
        <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
          ({roadmapData.courses?.length ?? 0} {en.contentRepository.courses},
          &nbsp;
          {`${calculateRoadmapProgress()}% `}
          {en.common.complete})
        </p>
      </motion.div>

      <motion.div
        className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        variants={headerVariants}
      >
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
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
                const percentage = calculateCourseProgress(course);

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
                      title={course.description}
                      link={`${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course.id}`}
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
};

export default RoadmapDetails;
