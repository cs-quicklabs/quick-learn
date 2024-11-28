'use client';
import { getRoadmap } from '@src/apiServices/contentRepositoryService';
import { getLessonDetails } from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson, TRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

const LessonDetails = () => {
  const {
    roadmap: roadmapId,
    course: courseId,
    lesson: lessonId,
  } = useParams<{
    roadmap: string;
    course: string;
    lesson: string;
  }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<TLesson>();
  const [roadmap, setRoadmap] = useState<TRoadmap>();

  // To set the links for the breadcrumb
  const links = useMemo<TBreadcrumb[]>(() => {
    const url = `${RouteEnum.CONTENT}/${roadmapId}/${courseId}/${lessonId}`;
    if (!roadmap) {
      return [
        ...defaultlinks,
        {
          name: lesson?.course?.name ?? 'Course',
          link: `${RouteEnum.CONTENT}/${roadmapId}/${courseId}`,
        },
        { name: lesson?.name ?? en.common.addLesson, link: url },
      ];
    }
    return [
      ...defaultlinks,
      { name: roadmap.name, link: `${RouteEnum.CONTENT}/${roadmapId}` },
      {
        name: roadmap.courses[0].name,
        link: `${RouteEnum.CONTENT}/${roadmapId}/${courseId}`,
      },
      { name: lesson?.name ?? en.common.addLesson, link: url },
    ];
  }, [roadmap, lesson, roadmapId, courseId, lessonId]);

  useEffect(() => {
    if (!(isNaN(+roadmapId) || isNaN(+courseId))) {
      getRoadmap(roadmapId, courseId)
        .then((res) => setRoadmap(res.data))
        .catch((err) => showApiErrorInToast(err));
    }
    if (lessonId !== 'add') {
      getLessonDetails(lessonId, false)
        .then((res) => {
          setLesson(res.data);
        })
        .catch((err) => {
          showApiErrorInToast(err);
          router.replace(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
        });
    }
  }, [roadmapId, courseId, lessonId, router]);

  if (!lesson) return <FullPageLoader />;

  return <ViewLesson lesson={lesson} links={links} isPending={true} />;
};

export default LessonDetails;
