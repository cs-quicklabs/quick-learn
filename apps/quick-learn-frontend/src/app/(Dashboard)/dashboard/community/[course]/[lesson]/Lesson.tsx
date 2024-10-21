'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TLesson } from '@src/shared/types/contentRepository';
import { getLessonDetails } from '@src/apiServices/lessonsService';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { RouteEnum } from '@src/constants/route.enum';

const defaultlinks: TBreadcrumb[] = [
  { name: 'Community Repository', link: RouteEnum.COMMUNITY },
];

const Lesson = () => {
  const [lessonData, setLessonData] = useState<TLesson>();
  const params = useParams<{ course: string; lesson: string }>();
  const lessonId = params.lesson;
  const courseId = params.course;

  const links = useMemo<TBreadcrumb[]>(() => {
    const url = `${RouteEnum.COMMUNITY}/${courseId}/${lessonId}`;
    return [
      ...defaultlinks,
      {
        name: lessonData?.course?.name ? lessonData.course.name : 'Course',
        link: `${RouteEnum.COMMUNITY}/${courseId}`,
      },
      { name: lessonData?.name ? lessonData.name : 'Lesson', link: url },
    ];
  }, [courseId, lessonId, lessonData]);

  const getLessonData = useCallback(() => {
    if (!lessonId) return;
    getLessonDetails(lessonId)
      .then((res) => {
        setLessonData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [lessonId]);

  useEffect(() => {
    getLessonData();
  }, []);
  return (
    <div>{lessonData && <ViewLesson lesson={lessonData} links={links} />}</div>
  );
};

export default Lesson;
