'use client';
import { en } from '@src/constants/lang/en';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import AddEditRoadMapModal from '@src/shared/modals/addEditRoadMapModal';
import { useState } from 'react';

const ContentRepository = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <>
      <AddEditRoadMapModal open={openAddModal} setOpen={setOpenAddModal} />
      <div className="px-4 mb-8 sm:flex sm:items-center sm:justify-center sm:px-6 lg:px-8">
        <div className="items-baseline">
          <h1 className="text-5xl font-extrabold leading-tight">
            {en.contentRepository.contentRepository}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate sm:flex sm:items-center sm:justify-center capitalize">
            (10 {en.contentRepository.roadmaps}, 20{' '}
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <li key={item}>
                <Card />
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
      <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
        <div id="created-spaces">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <li key={item}>
                <Card />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ContentRepository;
