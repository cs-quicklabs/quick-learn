'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getCommunityCourse } from '@src/apiServices/contentRepositoryService';
import { TCourse } from '@src/shared/types/contentRepository';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { RouteEnum } from '@src/constants/route.enum';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { en } from '@src/constants/lang/en';
import Card from '@src/shared/components/Card';

const CommunityCourse = () => {
  const [courseData, setcourseData] = useState<TCourse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ course: string }>();
  const courseId = params.course;

  const getCourseDetails = useCallback(() => {
    if (!courseId) return;
    getCommunityCourse(courseId)
      .then((res) => {
        setcourseData(res.data);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    getCourseDetails();
  }, [courseId, getCourseDetails]);

  return (
    <div>
      {isLoading && <FullPageLoader />}
      {courseData && (
        <div className="w-full">
          {/* Heading */}
          <div className="flex flex-col gap-4 text-center">
            <div className="text-5xl font-bold">{courseData.name}</div>
            <div className="text-sm text-gray-500">
              {courseData.description}
            </div>
            <div className="text-sm  text-gray-500">{`(${courseData?.lessons?.length} ${en.lesson.lesson})`}</div>
          </div>
          {/* display all courses */}
          <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
            {courseData.lessons && courseData.lessons?.length != 0 ? (
              courseData.lessons.map((lesson) => {
                const formattedDate = format(
                  lesson.created_at,
                  DateFormats.shortDate,
                );
                return (
                  <li key={lesson.id}>
                    <Card
                      id={String(lesson.id)}
                      title={lesson.name}
                      description={lesson.content}
                      link={`${RouteEnum.COMMUNITY}/${courseId}/${lesson.id}`}
                      metadata={{
                        date: formattedDate,
                      }}
                    />
                  </li>
                );
              })
            ) : (
              <li className="flex justify-center  col-span-5 text-gray-500">
                {en.lesson.notfound}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommunityCourse;
