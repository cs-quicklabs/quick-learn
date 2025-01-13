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
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import ContentRepositorySkeleton from './ContentRepositorySkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchMetadata,
  updateContentRepository,
} from '@src/store/features/metadataSlice';
import {
  addRoadmap,
  fetchRoadmaps,
  selectAllCourses,
  selectAllRoadmaps,
  selectIsRoadmapsInitialized,
  selectRoadmapsStatus,
} from '@src/store/features/roadmapsSlice';

const ContentRepository = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const roadmaps = useAppSelector(selectAllRoadmaps);
  const courses = useAppSelector(selectAllCourses);
  const roadmapsStatus = useAppSelector(selectRoadmapsStatus);
  const isRoadmapsInitialized = useAppSelector(selectIsRoadmapsInitialized);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const isLoading = !isRoadmapsInitialized && roadmapsStatus === 'loading';

  // const fetchRoadmapData = async () => {
  //   try {
  //     const res = await getRoadmaps();
  //     // Update Redux store with the fetched roadmaps
  //     dispatch({
  //       type: 'roadmaps/fetchRoadmaps/fulfilled',
  //       payload: res.data,
  //     });
  //   } catch (error) {
  //     dispatch({
  //       type: 'roadmaps/fetchRoadmaps/rejected',
  //       payload: 'something went wrong',
  //     });
  //   }
  // };

  // const fetchContentRepositoryMetadata = async () => {
  //   try {
  //     const res = await getContentRepositoryMetadata();
  //     // Update Redux store with the fetched metadata
  //     dispatch(updateContentRepository(res.data));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the roadmaps and metadata concurrently
        await Promise.all([
          // fetchRoadmapData(),
          // fetchContentRepositoryMetadata(),
          fetchMetadata,
          fetchRoadmaps,
        ]);
      } catch (err) {
        // Log the error to the console for debugging
        console.error('Error fetching roadmaps and metadata:', err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  function onSubmit(data: AddEditRoadmapData) {
    setIsModalLoading(true);
    createRoadmap(data)
      .then((res) => {
        dispatch(addRoadmap(res.data));
        setOpenAddModal(false);
        router.push(`${RouteEnum.CONTENT}/${res.data.id}`);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsModalLoading(false));
  }

  if (isLoading) {
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
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {en.contentRepository.contentRepository}
          </h1>
          <p className="text-sm text-gray-500">
            ({roadmaps.length} {en.contentRepository.roadmaps}, {courses.length}{' '}
            {en.contentRepository.courses})
          </p>
        </div>

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
            <div
              style={{ scrollbarWidth: 'thin' }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4  pr-2"
            >
              <CreateNewCard
                title={en.contentRepository.createNewRoadmap}
                onAdd={() => setOpenAddModal(true)}
              />
              {roadmaps.map((item) => (
                <Card
                  key={item.id}
                  id={String(item.id)}
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
            <div
              style={{ scrollbarWidth: 'thin' }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 pr-2"
            >
              {courses.map((item) => (
                <Card
                  key={item.id}
                  title={item.name}
                  description={item.description}
                  id={String(item.id)}
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
