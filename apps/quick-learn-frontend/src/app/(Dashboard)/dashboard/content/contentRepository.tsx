'use client';
import {
  createRoadmap,
  getRoadmaps,
} from '@src/apiServices/contentRepositoryService';
import { en } from '@src/constants/lang/en';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import AddEditRoadMapModal, {
  AddEditRoadmapData,
} from '@src/shared/modals/addEditRoadMapModal';
import { TRoadmap } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useEffect, useState } from 'react';

const ContentRepository = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<TRoadmap[]>([]);
  // TODO: Need to change this with the actual course data;
  const [courseCount, setCourseCount] = useState<number>(0);

  useEffect(() => {
    getRoadmaps()
      .then((res) => {
        res.data.forEach((item: TRoadmap) => {
          item?.courses_count &&
            setCourseCount((prev) => prev + (item?.courses_count || 0));
        });
        setRoadmaps(res.data);
      })
      .catch((err) => showApiErrorInToast(err));
  }, []);

  function onSubmit(data: AddEditRoadmapData) {
    console.log(data);
    setIsLoading(true);
    createRoadmap(data)
      .then((res) => {
        showApiMessageInToast(res);
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
            ({roadmaps.length} {en.contentRepository.roadmaps}, {courseCount}{' '}
            {en.contentRepository.courses})
          </p>
        </div>
      </div>
      <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <h1 className="text-3xl font-bold leading-tight capitalize">
            {en.contentRepository.allRoadmaps}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate capitalize">
            (10 {en.contentRepository.roadmaps})
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
            (20 {en.contentRepository.courses})
          </p>
        </div>
      </div>
      {/* <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
        <div id="created-spaces">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <li key={item}>
                <Card />
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </>
  );
};

export default ContentRepository;
