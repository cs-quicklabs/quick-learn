'use client';
import { getLearningPathLessionDetails } from '@src/apiServices/learningPathService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultlinks: TBreadcrumb[] = [
  { name: en.myLearningPath.heading, link: RouteEnum.MY_LEARNING_PATH },
];
const LessonDetails = () => {
  const { roadmap, course, lesson } = useParams<{
    roadmap: string;
    course: string;
    lesson: string;
  }>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [lessonDetails, setLessonDetails] = useState<TLesson>();
  const router = useRouter();

  useEffect(() => {
    getLearningPathLessionDetails(
      lesson,
      course,
      roadmap && !isNaN(+roadmap) ? roadmap : undefined,
    )
      .then((res) => {
        setLessonDetails(res.data);
        const tempLinks = [...defaultlinks];
        if (roadmap && !isNaN(+roadmap)) {
          tempLinks.push({
            name: res.data.course.roadmaps?.[0]?.name ?? '',
            link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}`,
          });
        }
        tempLinks.push({
          name: res.data.course.name ?? '',
          link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course}`,
        });
        tempLinks.push({
          name: res.data?.name ?? '',
          link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course}/${lesson}`,
        });
        setLinks(tempLinks);
      })
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(RouteEnum.MY_LEARNING_PATH);
      });
  }, [lesson, course, roadmap]);

  if (!lessonDetails) return <FullPageLoader />;
  return <ViewLesson lesson={lessonDetails} links={links} />;
};

export default LessonDetails;
