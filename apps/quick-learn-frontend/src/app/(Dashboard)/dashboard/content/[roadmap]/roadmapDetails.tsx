'use client';
import {
  ArrowRightEndOnRectangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { activateRoadmap } from '@src/apiServices/archivedService';
import {
  assignCoursesToRoadmap,
  createCourse,
  getRoadmap,
  updateRoadmap,
} from '@src/apiServices/contentRepositoryService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import AddEditCourseModal from '@src/shared/modals/addEditCourseModal';
import AddEditRoadMapModal from '@src/shared/modals/addEditRoadMapModal';
import AssignDataModal from '@src/shared/modals/assignDataModal';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import {
  TAssignModalMetadata,
  TCourse,
  TCreateCourse,
  TCreateRoadmap,
  TRoadmap,
} from '@src/shared/types/contentRepository';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectContentRepositoryMetadata,
  updateContentRepositoryCourse,
  updateContentRepositoryRoadmapCount,
} from '@src/store/features/metadataSlice';
import {
  selectRoadmapById,
  updateRoadmap as updateStoreRoadmap,
} from '@src/store/features/roadmapsSlice';
import { AppDispatch } from '@src/store/store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { format } from 'date-fns';
import Tooltip from '@src/shared/components/Tooltip';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoadmapDetailsSkeleton from './RoadmapDetailsSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { AxiosErrorObject } from '@src/apiServices/axios';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

function RoadmapDetails() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { roadmap: roadmapId } = useParams<{ roadmap: string }>();

  // Get roadmap from store
  const roadmapFromStore = useSelector(
    selectRoadmapById(parseInt(roadmapId, 10)),
  );
  const contentRepositoryMetadata = useSelector(
    selectContentRepositoryMetadata,
  );

  const allCourseCategories = contentRepositoryMetadata.course_categories;
  const allRoadmapCategories = contentRepositoryMetadata.roadmap_categories;

  // State management
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddCourseModal, setOpenAddCourseModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [showConformationModal, setShowConformationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<TRoadmap | undefined>(
    roadmapFromStore,
  );
  const [courses, setCourses] = useState<TCourse[]>(
    roadmapFromStore?.courses || [],
  );
  const [links, setLinks] = useState<TBreadcrumb[]>(() => {
    if (roadmapFromStore) {
      return [
        ...defaultlinks,
        {
          name: roadmapFromStore.name,
          link: `${RouteEnum.CONTENT}/${roadmapId}`,
        },
      ];
    }
    return defaultlinks;
  });
  const [courseCategoriesData, setCourseCategoriesData] = useState<
    TAssignModalMetadata[]
  >([]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await getRoadmap(roadmapId);
        const fetchedRoadmap = res.data;
        setRoadmapData(fetchedRoadmap);
        setCourses(fetchedRoadmap.courses || []);
        setLinks([
          ...defaultlinks,
          {
            name: fetchedRoadmap.name,
            link: `${RouteEnum.CONTENT}/${roadmapId}`,
          },
        ]);
        dispatch(updateStoreRoadmap(fetchedRoadmap));
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
      }
    };

    if (!parseInt(roadmapId, 10)) {
      router.replace(RouteEnum.CONTENT);
      return;
    }

    fetchRoadmap();
  }, [roadmapId, dispatch, router]);

  useEffect(() => {
    const data = allCourseCategories
      .filter((category) => category.courses.length > 0)
      .map((item) => ({
        name: item.name,
        list: item.courses.map((course) => ({
          name: course.name,
          value: Number(course.id),
          roadmap_count: course.roadmaps_count,
        })),
      }));
    setCourseCategoriesData(data);
  }, [allCourseCategories]);

  const onEdit = async (data: TCreateRoadmap) => {
    setIsLoading(true);
    try {
      const res = await updateRoadmap(roadmapId, data);
      setOpenAddModal(false);
      if (!roadmapData) return;
      const updatedRoadmap = { ...roadmapData, ...data };
      setRoadmapData(updatedRoadmap);
      dispatch(updateStoreRoadmap(updatedRoadmap));
      showApiMessageInToast(res);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddCourse = async (data: TCreateCourse) => {
    setIsLoading(true);
    try {
      const res = await createCourse({ ...data, roadmap_id: +roadmapId });
      setOpenAddCourseModal(false);
      dispatch(updateContentRepositoryCourse(res.data));
      const updatedCourses = [...courses, res.data];
      setCourses(updatedCourses);
      if (roadmapData) {
        const updatedRoadmap = { ...roadmapData, courses: updatedCourses };
        setRoadmapData(updatedRoadmap);
        dispatch(updateStoreRoadmap(updatedRoadmap));
      }
      showApiMessageInToast(res);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateContentRepoRoadmapcount = (data: string[]) => {
    // Get initially assigned courses or empty array if roadmapData is undefined
    const initialCourses =
      roadmapData?.courses?.map((course) => String(course.id)) || [];

    // Find courses that were removed (present in initial but not in selected)
    const removedCourses = initialCourses
      .filter((courseId) => !data.includes(courseId))
      .map((courseId) => ({ id: courseId, action: -1 }));

    // Find courses that were added (present in selected but not in initial)
    const addedCourses = data
      .filter((courseId) => !initialCourses.includes(courseId))
      .map((courseId) => ({ id: courseId, action: 1 }));

    // Combine added and removed courses
    const updates: { id: string; action: number }[] = [
      ...removedCourses,
      ...addedCourses,
    ];
    dispatch(updateContentRepositoryRoadmapCount(updates));
  };

  const assignCourses = async (data: string[]) => {
    setIsLoading(true);
    try {
      const res = await assignCoursesToRoadmap(roadmapId, data);
      const updatedRoadmap = await getRoadmap(roadmapId);
      dispatch(updateStoreRoadmap(updatedRoadmap.data));
      setRoadmapData(updatedRoadmap.data);
      setCourses(updatedRoadmap.data.courses || []);
      setOpenAssignModal(false);
      handleUpdateContentRepoRoadmapcount(data);
      showApiMessageInToast(res);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  const onArchive = async () => {
    setIsLoading(true);
    try {
      const res = await activateRoadmap({ id: +roadmapId, active: false });
      showApiMessageInToast(res);

      const coursesId = roadmapData?.courses.map((item) => item.id) || [];
      const updatedRoadmapCategories = allRoadmapCategories.map((category) => ({
        ...category,
        roadmaps: category.roadmaps.filter((ele) => ele.id !== +roadmapId),
      }));

      const updatedCourseCategories = allCourseCategories.map((category) => ({
        ...category,
        courses: category.courses.filter((ele) => !coursesId.includes(ele.id)),
      }));

      dispatch({
        type: 'metadata/updateContentRepository',
        payload: {
          roadmap_categories: updatedRoadmapCategories,
          course_categories: updatedCourseCategories,
        },
      });

      setShowConformationModal(false);
      router.replace(RouteEnum.CONTENT);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  if (!roadmapFromStore && !roadmapData) {
    return <RoadmapDetailsSkeleton />;
  }

  if (!roadmapData) {
    return null;
  }

  const hasCourses = courses.length > 0;

  return (
    <>
      <AddEditRoadMapModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        isAdd={false}
        onSubmit={onEdit}
        isloading={isLoading}
        initialData={roadmapData}
      />

      <AddEditCourseModal
        open={openAddCourseModal}
        setOpen={setOpenAddCourseModal}
        isAdd
        onSubmit={onAddCourse}
        isloading={isLoading}
      />
      {openAssignModal && (
        <AssignDataModal
          show={openAssignModal}
          setShow={setOpenAssignModal}
          heading={en.roadmapDetails.addExistingCourses}
          sub_heading={en.common.selectCourses}
          isLoading={isLoading}
          data={courseCategoriesData}
          initialValues={{
            selected: roadmapData.courses.map((item) => String(item.id)) || [],
          }}
          onSubmit={assignCourses}
        />
      )}

      <ConformationModal
        title={en.roadmapDetails.archiveConfirmHeading}
        subTitle={en.roadmapDetails.archiveConfirmSubHeading}
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={onArchive}
      />

      <Breadcrumb links={links} />
      <div className="container mx-auto px-4">
        {/* Roadmap Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold first-letter:uppercase mb-2 text-center">
            {roadmapData.name}
          </h1>
          <p className="text-sm text-gray-500 text-center">
            <span className="capitalize">
              {roadmapData.created_by
                ? `${roadmapData.created_by.first_name} ${roadmapData.created_by.last_name}`
                : 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisRoadmapOn}&nbsp;
            {roadmapData.created_at &&
              format(roadmapData.created_at, DateFormats.shortDate)}
          </p>
          <p className="text-sm text-gray-500 text-center">
            ({roadmapData.courses?.length ?? 0} {en.contentRepository.courses},
            &nbsp;
            {roadmapData.courses?.reduce(
              (acc, curr) => acc + (curr?.lessons_count ?? 0),
              0,
            ) ?? 0}{' '}
            {en.common.lessons}, &nbsp;
            {roadmapData.userCount ?? 0} {en.common.participants})
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Tooltip content={en.contentRepository.editRoadmap}>
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setOpenAddModal(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </Tooltip>

            <Tooltip content={en.contentRepository.addOnAlreadyExistingCourse}>
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setOpenAssignModal(true)}
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              </button>
            </Tooltip>

            <Tooltip content={en.contentRepository.archiveRoadmap}>
              <button
                id="archiveRoadmap"
                type="button"
                className="text-black bg-gray-300 hover:bg-red-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setShowConformationModal(true)}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Courses Section */}
        <div className="px-4">
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {en.contentRepository.allCourses}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({roadmapData.courses?.length ?? 0} {en.contentRepository.courses}
              )
            </p>
          </div>
          {hasCourses ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              <CreateNewCard
                title={en.roadmapDetails.createNewCourse}
                onAdd={() => setOpenAddCourseModal(true)}
              />
              {courses.map((item) => (
                <Card
                  key={item.id}
                  id={String(item.id)}
                  title={item.name}
                  description={item.description}
                  stats={`${item.lessons_count || 0} ${en.common.lessons}`}
                  link={`${RouteEnum.CONTENT}/${roadmapId}/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="courses"
              customTitle={en.contentRepository.noCourses}
              customDescription={en.contentRepository.noCoursesDescription}
              actionButton={{
                label: en.roadmapDetails.createNewCourse,
                onClick: () => setOpenAddCourseModal(true),
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RoadmapDetails;
