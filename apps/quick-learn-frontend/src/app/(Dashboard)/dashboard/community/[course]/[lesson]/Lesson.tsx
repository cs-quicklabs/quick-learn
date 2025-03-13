'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TLesson } from '@src/shared/types/contentRepository';
import { getLessonDetails } from '@src/apiServices/lessonsService';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { RouteEnum } from '@src/constants/route.enum';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import LessonSkeleton from '@src/shared/components/LessonSkeleton';

const defaultlinks: TBreadcrumb[] = [
  { name: 'Community Repository', link: RouteEnum.COMMUNITY },
];

function Lesson() {
  const [lessonData, setLessonData] = useState<TLesson>();
  const params = useParams<{ course: string; lesson: string }>();
  const lessonId = params.lesson;
  const courseId = params.course;

  const url = `${RouteEnum.COMMUNITY}/${courseId}/${lessonId}`;

  const links: TBreadcrumb[] = [
    ...defaultlinks,
    {
      name: lessonData?.course?.name ?? 'Course',
      link: `${RouteEnum.COMMUNITY}/${courseId}`,
    },
    { name: lessonData?.name ?? 'Lesson', link: url },
  ];

  const getLessonData = () => {
    if (!lessonId) return;
    getLessonDetails(lessonId)
      .then((res) => {
        setLessonData(res.data);
      })
      .catch((err) => showApiErrorInToast(err));
  };

  useEffect(() => {
    getLessonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lessonData) return <LessonSkeleton />;

  return (
    <div>{lessonData && <ViewLesson lesson={lessonData} links={links} />}</div>
  );
}

export default Lesson;
