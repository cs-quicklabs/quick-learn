'use client';
import { PencilIcon } from '@heroicons/react/20/solid';
import { getRoadmap } from '@src/apiServices/contentRepositoryService';
import { getLessonDetails } from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson, TRoadmap } from '@src/shared/types/contentRepository';
import { selectUser } from '@src/store/features/userSlice';
import { SuperLink } from '@src/utils/HiLink';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { UserTypeIdEnum } from 'lib/shared/src';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

function LessonDetails() {
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
  const user = useSelector(selectUser);
  const canEdit = useMemo(() => {
    return user?.user_type_id === UserTypeIdEnum.EDITOR;
  }, [user]);

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

  if (!user) return <FullPageLoader />;
  if (!lesson) return <FullPageLoader />;

  return (
    <>
      <ViewLesson lesson={lesson} links={links} isPending />
      {canEdit && (
        <SuperLink
          href={`${RouteEnum.CONTENT}/${roadmapId}/${courseId}/edit/${lessonId}`}
        >
          <span className="fixed flex items-center bottom-4 right-4 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500">
            <PencilIcon className="flex-shrink-0 inline w-4 h-4 me-1" />| Edit
          </span>
        </SuperLink>
      )}
    </>
  );
}

export default LessonDetails;
