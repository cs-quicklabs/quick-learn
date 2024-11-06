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
import AddEditRoadMapModal, {
  AddEditRoadmapData,
} from '@src/shared/modals/addEditRoadMapModal';
import { TCourse, TRoadmap } from '@src/shared/types/contentRepository';
import useDashboardStore from '@src/store/dashboard.store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import ContentRepositorySkeleton from './ContentRepositorySkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';

const ContentRepository = () => {
  const router = useRouter();
  const { setContentRepositoryMetadata, metadata } = useDashboardStore(
    (state) => state,
  );
  const allCourseCategories = metadata.contentRepository.course_categories;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<TRoadmap[]>([]);
  const [courses, setCourses] = useState<TCourse[]>([]);

  useEffect(() => {
    Promise.all([
      getContentRepositoryMetadata()
        .then((response) => setContentRepositoryMetadata(response.data))
        .catch((error) => showApiErrorInToast(error)),
      getRoadmaps()
        .then((res) => setRoadmaps(res.data))
        .catch((err) => showApiErrorInToast(err)),
    ]).finally(() => setIsPageLoading(false));
  }, [setContentRepositoryMetadata]);

  useEffect(() => {
    const data: TCourse[] = [];
    allCourseCategories.forEach((category) => {
      if (!category.courses) category.courses = [];
      data.push(...category.courses);
    });
    setCourses(data);
  }, [allCourseCategories]);

  function onSubmit(data: AddEditRoadmapData) {
    setIsModalLoading(true);
    createRoadmap(data)
      .then((res) => {
        setRoadmaps((prev) => [res.data, ...prev]);
        setOpenAddModal(false);
        router.push(`${RouteEnum.CONTENT}/${res.data.id}`);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsModalLoading(false));
  }

  if (isPageLoading) {
    return <ContentRepositorySkeleton />;
  }

  return (
    <>
      <AddEditRoadMapModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={onSubmit}
        isloading={isModalLoading}
      />

      <div className="container mx-auto px-4">
        {/* Main Heading */}
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {en.contentRepository.contentRepository}
          </h1>
          <p className="text-sm text-gray-500">
            ({roadmaps.length} {en.contentRepository.roadmaps}, {courses.length}{' '}
            {en.contentRepository.courses})
          </p>
        </div>

        {/* Roadmaps Section */}
        <section className="mb-12">
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {en.contentRepository.allRoadmaps}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({roadmaps.length} {en.contentRepository.roadmaps})
            </p>
          </div>

          {roadmaps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              <CreateNewCard
                title={en.contentRepository.createNewRoadmap}
                onAdd={setOpenAddModal}
              />
              {roadmaps.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  description={item.description}
                  stats={`${item.courses_count || 0} ${en.common.courses}, ${
                    item?.courses?.reduce(
                      (acc, curr) => acc + (curr?.lessons_count ?? 0),
                      0,
                    ) || 0
                  } ${en.common.lessons}`}
                  link={`${RouteEnum.CONTENT}/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="roadmaps"
              customTitle={en.contentRepository.noRoadmaps}
              customDescription={en.contentRepository.noRoadmapsDescription}
              actionButton={{
                label: en.contentRepository.createNewRoadmap,
                onClick: () => setOpenAddModal(true),
              }}
            />
          )}
        </section>

        {/* Courses Section */}
        <section>
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {en.contentRepository.allCourses}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({courses.length} {en.contentRepository.courses})
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              {courses.map((item) => (
                <Card
                  key={item.id}
                  title={item.name}
                  description={item.description}
                  id={item.id}
                  stats={`${item.lessons_count ?? 0} ${en.common.lessons}`}
                  link={`${RouteEnum.CONTENT}/courses/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="courses"
              customTitle={en.contentRepository.noCourses}
              customDescription={en.contentRepository.noCoursesDescription}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default ContentRepository;
