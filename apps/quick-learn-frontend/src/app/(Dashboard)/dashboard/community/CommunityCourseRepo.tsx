'use client';
import React, { useEffect, useState } from 'react';
import { RouteEnum } from '@src/constants/route.enum';
import { en } from '@src/constants/lang/en';
import { getCommunityCourses } from '@src/apiServices/contentRepositoryService';
import { TCourse } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import Card from '@src/shared/components/Card';
import CommunityCoursesSkeleton from './CommunityCardSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';

function CommunityCourseRepository() {
  const [allCourses, setAllCourses] = useState<TCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    getCommunityCourses()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllCourses(res.data);
        }
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <CommunityCoursesSkeleton />;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="flex flex-col gap-4 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          {en.CommunityCouse.heading}
        </h1>
        {allCourses.length > 0 && (
          <>
            <p className="text-sm text-gray-500">
              {en.CommunityCouse.description}
            </p>
            <p className="text-sm text-gray-500">
              ({allCourses.length} {en.CommunityCouse.course})
            </p>
          </>
        )}
      </div>

      {/* Courses Grid */}
      {allCourses.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {allCourses.map((course) => {
            const formattedDate = format(
              course.created_at,
              DateFormats.shortDate,
            );
            return (
              <Card
                key={course.id}
                id={String(course.id)}
                title={course.name}
                description={course.description}
                stats={`${course?.lessons_count} ${en.lesson.lesson}`}
                link={`${RouteEnum.COMMUNITY}/${course.id}`}
                metadata={{
                  addedBy:
                    `${course.created_by?.first_name || ''} ${
                      course.created_by?.last_name || ''
                    }`.trim() || 'Admin',
                  date: formattedDate,
                }}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          type="courses"
          customTitle={en.CommunityCouse.noCommunityCoursesTitle}
          customDescription={en.CommunityCouse.noCommunityCoursesDescription}
        />
      )}
    </div>
  );
}

export default CommunityCourseRepository;
