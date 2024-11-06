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
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultlinks: TBreadcrumb[] = [
  { name: en.myLearningPath.heading, link: RouteEnum.MY_LEARNING_PATH },
];

const RoadmapDetails = () => {
  const { roadmap } = useParams<{ roadmap: string }>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [roadmapData, setRoadmapData] = useState<TRoadmap>();

  useEffect(() => {
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
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  }, [roadmap]);

  return (
    <>
      {isPageLoading && <RoadmapCourseSkeleton />}
      <div>
        <Breadcrumb links={links} />
        <div className="items-baseline mb-8">
          <h1 className="text-center text-5xl font-extrabold leading-tight capitalize">
            {roadmapData?.name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
            ({roadmapData?.courses?.length ?? 0} {en.contentRepository.courses},
            &nbsp;
            {'0% '}
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
        {roadmapData?.courses.length === 0 ? (
          <EmptyState type="courses" />
        ) : (
          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {roadmapData?.courses.map((course) => (
                <ProgressCard
                  key={course.id}
                  id={+course.id}
                  name={course.name}
                  title={course.description}
                  link={`${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course.id}`}
                  // percentage={course.percentage || 0}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default RoadmapDetails;
