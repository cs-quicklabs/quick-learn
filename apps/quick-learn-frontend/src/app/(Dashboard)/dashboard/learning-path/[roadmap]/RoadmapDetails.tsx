'use client';
import { getLearningPathRoadmap } from '@src/apiServices/learningPathService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import ProgressCard from '@src/shared/components/ProgressCard';
import RoadmapCourseSkeleton from '@src/shared/components/roadmapCourseSkeleton';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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

const RoadmapDetails = () => {
  const { member, roadmap } = useParams<{ member: string; roadmap: string }>();
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
  }, []);

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [roadmapData, setRoadmapData] = useState<TRoadmap>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [memberUserProgress, setMemberUserProgress] = useState<
    UserLessonProgress[]
  >([]);

  const userProgress = useAppSelector(selectUserProgress);
  const progressStatus = useAppSelector(selectUserProgressStatus);

  useEffect(() => {
    !member && dispatch(fetchUserProgress());
  }, [dispatch]);

  useEffect(() => {
    setIsPageLoading(true);
    getLearningPathRoadmap(roadmap, Number(member))
      .then((res) => {
        setRoadmapData(res.data);
        setLinks([
          ...defaultlinks,
          {
            name: res.data.name,
            link: `${baseLink}/${roadmap}`,
          },
        ]);
      })
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(baseLink);
      })
      .finally(() => setIsPageLoading(false));
    if (member) {
      getUserProgress(Number(member))
        .then((res) => setMemberUserProgress(res.data))
        .catch((e) => showApiErrorInToast(e));
    }
  }, [router, roadmap]);

  const isLoading = isPageLoading || progressStatus === 'loading';

  if (isLoading) {
    return <RoadmapCourseSkeleton />;
  }

  return (
    <>
      <div>
        <Breadcrumb links={links} />
        <div className="items-baseline mb-8">
          <h1 className="text-center text-5xl font-extrabold leading-tight capitalize">
            {roadmapData?.name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
            ({roadmapData?.courses?.length ?? 0} {en.contentRepository.courses},
            &nbsp;
            {`${calculateRoadmapProgress(
              roadmapData,
              member ? memberUserProgress : userProgress,
            )}% `}
            {en.common.complete})
          </p>
        </div>
      </div>
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.common.myCourses}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            {en.common.coursesCount.replace(
              '{count}',
              (roadmapData?.courses || []).length.toString(),
            )}
          </p>
        </div>
      </div>
      <div className="relative px-6 grid gap-10 pb-16">
        {!roadmapData?.courses?.length ? (
          <EmptyState type="courses" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {roadmapData.courses.map((course) => {
                const percentage = calculateCourseProgress(
                  course,
                  member ? memberUserProgress : userProgress,
                );

                return (
                  <ProgressCard
                    key={course.id}
                    id={Number(course.id)}
                    name={course.name}
                    title={course.description}
                    link={`${baseLink}/${roadmap}/${course.id}`}
                    percentage={percentage}
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

export default RoadmapDetails;
