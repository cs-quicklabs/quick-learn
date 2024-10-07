'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  createRoadmap,
  getContentRepositoryMetadata,
  getRoadmaps,
} from '@src/apiServices/contentRepositoryService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import { FullPageLoader } from '@src/shared/components/UIElements';
import AddEditRoadMapModal, {
  AddEditRoadmapData,
} from '@src/shared/modals/addEditRoadMapModal';
import { TCourse, TRoadmap } from '@src/shared/types/contentRepository';
import useDashboardStore from '@src/store/dashboard.store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';

const ContentRepository = () => {
  const router = useRouter();
  const { setContentRepositoryMetadata, metadata } = useDashboardStore(
    (state) => state,
  );
  const allCourseCategories = metadata.contentRepository.course_categories;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<TRoadmap[]>([]);
  const [courses, setCourses] = useState<TCourse[]>([]);

  useEffect(() => {
    setIsPageLoading(true);
    getContentRepositoryMetadata()
      .then((response) => setContentRepositoryMetadata(response.data))
      .catch((error) => showApiErrorInToast(error))
      .finally(() => setIsPageLoading(false));
  }, [setContentRepositoryMetadata]);

  useEffect(() => {
    getRoadmaps()
      .then((res) => {
        setRoadmaps(res.data);
      })
      .catch((err) => showApiErrorInToast(err));
  }, []);

  useEffect(() => {
    const data: TCourse[] = [];
    allCourseCategories.forEach((category) => {
      if (!category.courses) category.courses = [];
      data.push(...category.courses);
    });
    setCourses(data);
  }, [allCourseCategories]);

  function onSubmit(data: AddEditRoadmapData) {
    setIsLoading(true);
    createRoadmap(data)
      .then((res) => {
        setRoadmaps((prev) => [res.data, ...prev]);
        setOpenAddModal(false);
        router.push(`${RouteEnum.CONTENT}/${res.data.id}`);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      {isPageLoading && <FullPageLoader />}
      <AddEditRoadMapModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={onSubmit}
        isloading={isLoading}
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
                    (item.courses.reduce((acc, curr) => {
                      return acc + (curr?.lessons_count ?? 0);
                    }, 0) || 0) +
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
                {console.log(item)}
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
