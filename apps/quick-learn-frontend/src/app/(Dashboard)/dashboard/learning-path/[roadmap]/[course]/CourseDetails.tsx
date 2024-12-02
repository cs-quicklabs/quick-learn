'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import RoadmapCourseSkeleton from '@src/shared/components/roadmapCourseSkeleton';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { getLearningPathCourse } from '@src/apiServices/learningPathService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { TCourse } from '@src/shared/types/contentRepository';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import ProgressCard from '@src/shared/components/ProgressCard';
import { useAppSelector } from '@src/store/hooks';
import { selectUserProgress } from '@src/store/features/userProgressSlice';

const defaultlinks: TBreadcrumb[] = [
  { name: en.myLearningPath.heading, link: RouteEnum.MY_LEARNING_PATH },
];

const CourseDetails = () => {
  const { roadmap, course } = useParams<{ roadmap: string; course: string }>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [courseData, setCourseData] = useState<TCourse>();
  const router = useRouter();

  // Get progress data from Redux store
  const userProgress = useAppSelector(selectUserProgress);

  // Find the progress data for this specific course
  const courseProgress = useMemo(
    () =>
      userProgress?.find((progress) => progress.course_id === Number(course))
        ?.lessons || [],
    [userProgress, course],
  );

  useEffect(() => {
    setIsPageLoading(true);
    getLearningPathCourse(course, !isNaN(+roadmap) ? roadmap : undefined)
      .then((res) => {
        setCourseData(res.data);
        const tempLinks = [...defaultlinks];
        if (roadmap && !isNaN(+roadmap)) {
          tempLinks.push({
            name: res.data?.roadmaps?.[0]?.name ?? '',
            link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}`,
          });
        }
        tempLinks.push({
          name: res.data?.name ?? '',
          link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course}`,
        });
        setLinks(tempLinks);
      })
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(RouteEnum.MY_LEARNING_PATH);
      })
      .finally(() => setIsPageLoading(false));
  }, [router, roadmap, course]);

  const progressPercentage = useMemo(() => {
    if (!courseProgress?.length || !courseData?.lessons?.length) {
      return 0;
    }
    const courseLessonIds = new Set(
      courseData.lessons.map((lesson) => lesson.id),
    );
    const completedCount = courseProgress.filter((lesson) =>
      courseLessonIds.has(lesson.lesson_id),
    ).length;

    const totalLessons = courseData.lessons.length;
    return Math.round((completedCount / totalLessons) * 100);
  }, [courseProgress, courseData]);

  return (
    <>
      {isPageLoading && <RoadmapCourseSkeleton />}
      <Breadcrumb links={links} />
      <div className="items-baseline mb-8">
        <h1 className="text-center text-5xl font-extrabold leading-tight capitalize">
          {courseData?.name}
        </h1>
        <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
          ({courseData?.lessons?.length ?? 0} {en.common.lessons}, &nbsp;
          {progressPercentage === 0
            ? 'Not started yet'
            : `${progressPercentage}% ${en.common.complete}`}
          )
        </p>
      </div>

      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
      </div>

      <div className="relative px-6 grid gap-10 pb-16">
        {!courseData?.lessons?.length ? (
          <EmptyState type="lessons" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8">
              {courseData.lessons.map((lesson) => {
                const lessonProgress = courseProgress.find(
                  (progress) => progress.lesson_id === lesson.id,
                );

                return (
                  <ProgressCard
                    key={lesson.id}
                    id={+lesson.id}
                    name={lesson.name}
                    title={lesson.content}
                    link={`${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course}/${lesson.id}`}
                    isCompleted={lessonProgress}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetails;
