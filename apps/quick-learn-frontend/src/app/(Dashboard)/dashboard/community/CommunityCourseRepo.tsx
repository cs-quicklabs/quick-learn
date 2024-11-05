'use client';
import { RouteEnum } from '@src/constants/route.enum';
import { en } from '@src/constants/lang/en';
import { getCommunityCourses } from '@src/apiServices/contentRepositoryService';
import { useEffect, useState } from 'react';
import { TCourse } from '@src/shared/types/contentRepository';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import Card from '@src/shared/components/Card';

const CommunityCoursesRepository = () => {
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

  return (
    <>
      {isLoading && <FullPageLoader />}
      <div>
        {/* Heading */}
        <div className="flex flex-col gap-4 text-center">
          <div className="text-5xl font-bold">{en.CommunityCouse.heading}</div>
          <div className="text-sm text-gray-500">
            {en.CommunityCouse.description}
          </div>
          <div className="text-sm  text-gray-500">
            ({allCourses && allCourses.length} {en.CommunityCouse.course})
          </div>
        </div>
        {/* display all courses */}
        <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
          {allCourses && allCourses.length > 0 ? (
            allCourses.map((course) => {
              return (
                <li key={course.id}>
                  <Card
                    id={course.id}
                    title={course.name}
                    description={course.description}
                    stats={`${course?.lessons_count} ${en.lesson.lesson}`}
                    link={`${RouteEnum.COMMUNITY}/${course.id}`}
                    metadata={{
                      addedBy: course.created_by?.first_name,
                    }}
                  />
                </li>
              );
            })
          ) : (
            <li className="flex justify-center col-span-5 text-gray-500">
              {en.CommunityCouse.notfound}
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default CommunityCoursesRepository;
