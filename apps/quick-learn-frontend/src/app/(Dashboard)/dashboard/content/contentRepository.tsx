'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import ContentRepositorySkeleton from './ContentRepositorySkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  addRoadmap,
  selectAllCourses,
  selectAllRoadmaps,
  selectIsRoadmapsInitialized,
} from '@src/store/features/roadmapsSlice';
import { useFetchContentRepositoryMetadata } from '@src/context/contextHelperService';
import { useSelector } from 'react-redux';
import { selectUser } from '@src/store/features/userSlice';
import { UserTypeIdEnum } from 'lib/shared/src';
import { updateContentRepositoryRoadmap } from '@src/store/features';

function ContentRepository() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const roadmaps = useAppSelector(selectAllRoadmaps);
  const courses = useAppSelector(selectAllCourses);
  const isRoadmapsInitialized = useAppSelector(selectIsRoadmapsInitialized);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(!isRoadmapsInitialized);
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('roadmaps');

  const fetchRoadmapData = async () => {
    try {
      const res = await getRoadmaps();
      dispatch({
        type: 'roadmaps/fetchRoadmaps/fulfilled', //update redux store roadmaps and courses
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'roadmaps/fetchRoadmaps/rejected',
        payload: 'Failed to fetch roadmaps',
      });
    }
  };

  const { fetchMetadata } = useFetchContentRepositoryMetadata(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchRoadmapData(),
          fetchMetadata(user?.user_type_id ?? UserTypeIdEnum.MEMBER),
        ]);
      } catch (err) {
        // Log the error to the console for debugging
        console.error('Error fetching roadmaps and metadata:', err);
      }
      setIsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  function onSubmit(data: AddEditRoadmapData) {
    setIsModalLoading(true);
    createRoadmap(data)
      .then((res) => {
        dispatch(addRoadmap(res.data));
        //add roadmap to metadata as well
        dispatch(updateContentRepositoryRoadmap(res.data));
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
          <h1 className="text-4xl text-center md:text-5xl font-bold mb-2">
            {en.contentRepository.contentRepository}
          </h1>
          <p className="text-sm text-gray-500">
            ({roadmaps.length} {en.contentRepository.roadmaps}, {courses.length}{' '}
            {en.contentRepository.courses})
          </p>
        </div>
        <section className="md:hidden w-[312px] border border-gray-200 bg-gray-100 mt-10 mb-5 rounded-md">
          <div className="max-w-full px-1 mx-auto">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  activeTab === 'roadmaps'
                    ? 'bg-white rounded-md text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('roadmaps')}
              >
                {en.contentRepository.allRoadmaps}{' '}
                <span className="text-sm ml-1">({roadmaps.length})</span>
              </button>
              <button
                type="button"
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  activeTab === 'courses'
                    ? 'bg-white rounded-md text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('courses')}
              >
                {en.contentRepository.allCourses}{' '}
                <span className="text-sm ml-1">({courses.length})</span>
              </button>
            </div>
          </div>
        </section>

        <section
          className={`mb-12 + ${activeTab === 'courses' ? 'hidden md:block' : 'block'}`}
        >
          <div className="hidden md:flex items-baseline mb-6">
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
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4  pr-2"
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

        <section
          className={`${activeTab === 'roadmaps' ? 'hidden md:block' : 'block'}`}
        >
          <div className="hidden md:flex items-baseline mb-6">
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
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 pr-2"
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
}

export default ContentRepository;
