'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPublicLessonDetails } from '@src/apiServices/lessonsService';
import { RouteEnum } from '@src/constants/route.enum';
import LessonSkeleton from '@src/shared/components/LessonSkeleton';
import { LessonContent, LessonHeader } from '@src/shared/components/ViewLesson';

function PublicLesson() {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();
  // Ensure content is never undefined
  const [lesson, setLesson] = useState<{
    name: string;
    content: string;
  } | null>(null);

  async function fetchLesson() {
    const navigateUserToLearningPath = () => {
      router.replace(RouteEnum.LOGIN);
    };
    if (uuid) {
      await getPublicLessonDetails(uuid)
        .then((res) => {
          setLesson({
            name: res.data.name,
            content: res.data.content,
          });
        })
        .catch(() => {
          navigateUserToLearningPath();
        });
    } else {
      navigateUserToLearningPath();
    }
  }

  useEffect(() => {
    fetchLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  if (!lesson) return <LessonSkeleton />;

  return (
    <div className="max-w-screen-2xl mx-auto mt-12 py-3 mb-12 sm:py-5 md:mb-0">
      <LessonHeader
        name={lesson?.name}
        full_name=""
        createdAt=""
        showCreatedBy={false}
      />
      <LessonContent content={lesson?.content || ''} />
    </div>
  );
}

export default PublicLesson;
