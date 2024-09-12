'use client';
import {
  createRoadmap,
  getRoadmaps,
} from '@src/apiServices/contentRepositoryService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import AddEditRoadMapModal, {
  AddEditRoadmapData,
} from '@src/shared/modals/addEditRoadMapModal';
import { TCourse, TRoadmap } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useEffect, useState } from 'react';

const ContentRepository = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<TRoadmap[]>([]);
  const [courses, setCourses] = useState<TCourse[]>([]);

  useEffect(() => {
    getRoadmaps()
      .then((res) => {
        res.data.forEach((item: TRoadmap) => {
          item?.courses.length > 0 &&
            setCourses((prev) => {
              const coursesId = prev.map((course) => course.id);
              const newCourses = item.courses.filter(
                (course) => !coursesId.includes(course.id),
              );
              return [...prev, ...newCourses];
            });
        });
        setRoadmaps(res.data);
      })
      .catch((err) => showApiErrorInToast(err));
  }, []);

  function onSubmit(data: AddEditRoadmapData) {
    setIsLoading(true);
    createRoadmap(data)
      .then((res) => {
        showApiMessageInToast(res);
        setRoadmaps((prev) => [res.data, ...prev]);
        setOpenAddModal(false);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <AddEditRoadMapModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={onSubmit}
        isloading={isloading}
      />
      <div className="px-4 mb-8 sm:flex sm:items-center sm:justify-center sm:px-6 lg:px-8">
        <div className="items-baseline">
          <h1 className="text-5xl font-extrabold leading-tight text-center">
            {en.contentRepository.contentRepository}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate sm:flex sm:items-center sm:justify-center capitalize text-center">
            ({roadmaps.length} {en.contentRepository.roadmaps},{' '}
            {courses.length ?? 0} {en.contentRepository.courses})
          </p>
        </div>
      </div>
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight capitalize">
            {en.contentRepository.allRoadmaps}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate capitalize">
            ({roadmaps.length ?? 0} {en.contentRepository.roadmaps})
          </p>
        </div>
      </div>
      <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
        <div id="created-spaces">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            <li>
              <CreateNewCard
                title={en.contentRepository.createNewRoadmap}
                onAdd={setOpenAddModal}
              />
            </li>
            {roadmaps.map((item) => (
              <li key={item.id}>
                <Card
                  id={item.id}
                  title={item.name}
                  description={item.description}
                  stats={
                    (item.courses_count || 0) +
                    ' ' +
                    en.common.courses +
                    ', ' +
                    (item.lessons_count || 0) +
                    ' ' +
                    en.common.lessons
                  }
                  link={`${RouteEnum.CONTENT}/${item.id}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight">
            {en.contentRepository.allCourses}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
            ({courses.length ?? 0} {en.contentRepository.courses})
          </p>
        </div>
      </div>
      <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
        <div id="created-spaces">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            {courses.map((item) => (
              <li key={item.id}>
                <Card
                  title={item.name}
                  description={item.description}
                  id={item.id}
                  stats={
                    '' + (item.lessons_count ?? 0) + ' ' + en.common.lessons
                  }
                  link={`${RouteEnum.CONTENT}/courses/${item.id}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ContentRepository;
