'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import RoadmapCourseSkeleton from '@src/shared/components/roadmapCourseSkeleton';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { getLearningPathCourse } from '@src/apiServices/learningPathService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { TUserCourse } from '@src/shared/types/contentRepository';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import ProgressCard from '@src/shared/components/ProgressCard';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchUserProgress,
  selectUserProgress,
  selectUserProgressStatus,
} from '@src/store/features/userProgressSlice';
import { UserLessonProgress } from '@src/shared/types/LessonProgressTypes';
import { getUserProgress } from '@src/apiServices/lessonsService';
import { motion } from 'framer-motion';
import { AxiosErrorObject } from '@src/apiServices/axios';

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

function CourseDetails() {
  const { member, roadmap, course } = useParams<{
    member: string;
    roadmap: string;
    course: string;
  }>();
  // dynamically set the url to Team member or own Learning path
  const baseLink = useMemo(() => {
    return member !== undefined
      ? `${RouteEnum.TEAM}/${member}`
      : RouteEnum.MY_LEARNING_PATH;
  }, [member]);

  const defaultlinks: TBreadcrumb[] = useMemo(() => {
    const links: TBreadcrumb[] = [];

    if (member !== undefined) {
      links.push({ name: 'Team', link: RouteEnum.TEAM });
    }

    links.push({
      name: member
        ? en.myLearningPath.learning_path
        : en.myLearningPath.heading,
      link: baseLink,
    });

    return links;
  }, [member, baseLink]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [courseData, setCourseData] = useState<TUserCourse>();

  const [memberUserProgress, setMemberUserProgress] = useState<
    UserLessonProgress[]
  >([]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get progress from Redux store

  const userProgress = useAppSelector(selectUserProgress);
  const progressStatus = useAppSelector(selectUserProgressStatus);

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch progress if it's not already loaded
      if (progressStatus === 'idle') {
        await dispatch(fetchUserProgress());
      }

      // Fetch course data only if progress is loaded or failed
      if (progressStatus === 'succeeded' || progressStatus === 'failed') {
        setIsPageLoading(true);
        try {
          const res = await getLearningPathCourse(
            course,
            Number(member),
            !isNaN(+roadmap) ? roadmap : undefined,
          );
          setCourseData(res.data);
          const tempLinks = [...defaultlinks];
          if (roadmap && !isNaN(+roadmap)) {
            tempLinks.push({
              name: res.data?.roadmaps?.[0]?.name ?? '',
              link: `${baseLink}/${roadmap}`,
            });
          }
          tempLinks.push({
            name: res.data?.name ?? '',
            link: `${baseLink}/${roadmap}/${course}`,
          });
          setLinks(tempLinks);
        } catch (err) {
          showApiErrorInToast(err as AxiosErrorObject);
          router.push(member ? baseLink : RouteEnum.MY_LEARNING_PATH);
        } finally {
          setIsPageLoading(false);
        }
      }
    };

    fetchData();
    if (member) {
      getUserProgress(Number(member))
        .then((res) => setMemberUserProgress(res.data))
        .catch((e) => showApiErrorInToast(e));
    }
  }, [
    dispatch,
    progressStatus,
    roadmap,
    course,
    router,
    member,
    defaultlinks,
    baseLink,
  ]);

  const courseLessonProgress = useMemo(() => {
    const courseProgress = member
      ? memberUserProgress?.find(
          (progress) => progress.course_id === Number(course),
        )
      : userProgress?.find((progress) => progress.course_id === Number(course));
    return courseProgress?.lessons || [];
  }, [userProgress, memberUserProgress, course, member]);

  const progressPercentage = useMemo(() => {
    if (!courseData?.lessons?.length) return 0;

    const courseLessonIds = new Set(
      courseData.lessons.map((lesson) => lesson.id),
    );

    const completedCount = courseLessonProgress.filter((lesson) =>
      courseLessonIds.has(lesson.lesson_id),
    ).length;
    return Math.round((completedCount / courseData.lessons.length) * 100);
  }, [courseLessonProgress, courseData]);

  const isLoading =
    isPageLoading || progressStatus === 'loading' || progressStatus === 'idle';

  if (isLoading) {
    return <RoadmapCourseSkeleton />;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={headerVariants}>
        <Breadcrumb links={links} />
      </motion.div>

      <motion.div className="items-baseline mb-8" variants={headerVariants}>
        <h1 className="text-center text-5xl font-extrabold leading-tight first-letter:uppercase">
          {courseData?.name}
        </h1>
        <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
          ({courseData?.lessons?.length ?? 0} {en.common.lessons}, &nbsp;
          {progressPercentage === 0
            ? 'Not started yet'
            : `${progressPercentage}% ${en.common.complete}`}
          )
        </p>
      </motion.div>

      <motion.div
        className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        variants={headerVariants}
      >
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.common.lessons}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {en.common.coursesCount.replace(
              '{count}',
              (courseData?.lessons || []).length.toString(),
            )}
          </p>
        </div>
      </motion.div>

      <div className="relative px-6 grid gap-10 pb-16">
        {!courseData?.lessons?.length ? (
          <EmptyState type="lessons" />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
              {courseData.lessons.map((lesson) => {
                const lessonProgress = courseLessonProgress.find(
                  (progress) => progress.lesson_id === lesson.id,
                );

                return (
                  <motion.li
                    key={lesson.id}
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <ProgressCard
                      id={+lesson.id}
                      name={lesson.name}
                      title={lesson.content}
                      className="w-full"
                      link={`${
                        member ? baseLink : RouteEnum.MY_LEARNING_PATH
                      }/${roadmap}/${course}/${lesson.id}`}
                      isCompleted={
                        lessonProgress
                          ? {
                              lesson_id: lessonProgress.lesson_id,
                              completed_date: new Date(
                                lessonProgress.completed_date,
                              ),
                            }
                          : undefined
                      }
                      isLesson
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

export default CourseDetails;
