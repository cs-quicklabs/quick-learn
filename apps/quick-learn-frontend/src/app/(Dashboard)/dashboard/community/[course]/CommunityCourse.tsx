'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunityCourse } from '@src/apiServices/contentRepositoryService';
import { TCourse } from '@src/shared/types/contentRepository';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { RouteEnum } from '@src/constants/route.enum';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { en } from '@src/constants/lang/en';
import Card from '@src/shared/components/Card';
import CommunityCourseDetailsSkeleton from './CommunityCourseDetailSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';

function CommunityCourse() {
  const [courseData, setCourseData] = useState<TCourse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ course: string }>();
  const courseId = params.course;

  const getCourseDetails = () => {
    if (!courseId) return;
    getCommunityCourse(courseId)
      .then((res) => {
        setCourseData(res.data);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <CommunityCourseDetailsSkeleton />;
  }

  if (!courseData) {
    return null;
  }

  const hasLessons = courseData.lessons && courseData.lessons.length > 0;

  return (
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="flex flex-col gap-4 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold first-letter:uppercase">
          {courseData.name}
        </h1>
        {hasLessons && (
          <>
            <p className="text-sm text-gray-500 first-letter:uppercase">
              {courseData.description}
            </p>
            <p className="text-sm text-gray-500">
              ({courseData.lessons?.length} {en.lesson.lesson})
            </p>
          </>
        )}
      </div>

      {/* Lessons Grid */}
      {hasLessons ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {courseData.lessons?.map((lesson) => {
            const formattedDate = format(
              lesson.created_at,
              DateFormats.shortDate,
            );
            return (
              <Card
                key={lesson.id}
                id={String(lesson.id)}
                title={lesson.name}
                description={lesson.content}
                link={`${RouteEnum.COMMUNITY}/${courseId}/${lesson.id}`}
                metadata={{
                  addedBy: lesson.created_by
                    ? `${lesson.created_by_user.first_name} ${lesson.created_by_user.last_name}`.trim()
                    : en.common.unknown,
                  date: formattedDate,
                }}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          type="lessons"
          customTitle={en.lesson.notfound}
          customDescription="No lessons have been added to this course yet."
        />
      )}
    </div>
  );
}

export default CommunityCourse;
