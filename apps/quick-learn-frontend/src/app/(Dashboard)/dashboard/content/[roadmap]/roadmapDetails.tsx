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
import useDashboardStore from '@src/store/dashboard.store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import RoadmapDetailsSkeleton from './RoadmapDetailsSkeleton';
import { AxiosErrorObject } from '@src/apiServices/axios';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

const RoadmapDetails = () => {
  // ... (keep all the existing state and functions)
  const router = useRouter();
  const { roadmap } = useParams<{ roadmap: string }>();
  const { setContentRepositoryMetadata, metadata } = useDashboardStore(
    (state) => state,
  );
  const allCourseCategories = metadata.contentRepository.course_categories;
  const allRoadmapCategories = metadata.contentRepository.roadmap_categories;

  // State management
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddCourseModal, setOpenAddCourseModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [showConformationModal, setShowConformationModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<TRoadmap>();
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [courseCategoriesData, setCourseCategoriesData] = useState<
    TAssignModalMetadata[]
  >([]);

  const getRoadmapData = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const res = await getRoadmap(roadmap);
      setRoadmapData(res.data);
      setLinks([
        ...defaultlinks,
        {
          name: res.data.name,
          link: `${RouteEnum.CONTENT}/${roadmap}`,
        },
      ]);
      if (res.data.courses?.length > -1) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsPageLoading(false);
    }
  }, [roadmap]);

  useEffect(() => {
    if (!parseInt(roadmap)) {
      router.replace(RouteEnum.CONTENT);
      return;
    }
    getRoadmapData();
  }, [roadmap, router, getRoadmapData]);

  useEffect(() => {
    const data = allCourseCategories.map((item) => ({
      name: item.name,
      list: item.courses.map((course) => ({
        name: course.name,
        value: Number(course.id),
      })),
    }));
    setCourseCategoriesData(data);
  }, [allCourseCategories]);

  const onEdit = async (data: TCreateRoadmap) => {
    setIsLoading(true);
    try {
      const res = await updateRoadmap(roadmap, data);
      setOpenAddModal(false);
      if (!roadmapData) return;
      setRoadmapData({ ...roadmapData, ...data });
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
      const res = await createCourse({ ...data, roadmap_id: +roadmap });
      setOpenAddCourseModal(false);
      setCourses((prev) => [...prev, res.data]);
      showApiMessageInToast(res);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  const assignCourses = async (data: string[]) => {
    setIsLoading(true);
    try {
      const res = await assignCoursesToRoadmap(roadmap, data);
      showApiMessageInToast(res);
      setOpenAssignModal(false);
      await getRoadmapData();
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };

  const onArchive = async () => {
    setIsLoading(true);
    try {
      const res = await activateRoadmap({ id: +roadmap, active: false });
      showApiMessageInToast(res);

      const coursesId = roadmapData?.courses.map((item) => item.id) || [];
      const updatedRoadmapCategories = allRoadmapCategories.map((category) => ({
        ...category,
        roadmaps: category.roadmaps.filter((ele) => ele.id !== roadmap),
      }));

      const updatedCourseCategories = allCourseCategories.map((category) => ({
        ...category,
        courses: category.courses.filter((ele) => !coursesId.includes(ele.id)),
      }));

      setContentRepositoryMetadata({
        ...metadata.contentRepository,
        roadmap_categories: updatedRoadmapCategories,
        course_categories: updatedCourseCategories,
      });

      setShowConformationModal(false);
      router.replace(RouteEnum.CONTENT);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsLoading(false);
    }
  };
  if (isPageLoading) {
    return <RoadmapDetailsSkeleton />;
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
        isAdd={true}
        onSubmit={onAddCourse}
        isloading={isLoading}
      />

      <AssignDataModal
        show={openAssignModal}
        setShow={setOpenAssignModal}
        heading={en.roadmapDetails.addExistingCourses}
        sub_heading={en.common.selectCourses}
        isLoading={isLoading}
        data={courseCategoriesData}
        initialValues={{
          selected: roadmapData?.courses.map((item) => String(item.id)) || [],
        }}
        onSubmit={assignCourses}
      />

      <ConformationModal
        title={en.roadmapDetails.archiveConfirmHeading}
        subTitle={en.roadmapDetails.archiveConfirmSubHeading}
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={onArchive}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb links={links} />

        {/* Roadmap Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold capitalize mb-2">
            {roadmapData?.name}
          </h1>
          <p className="text-sm text-gray-500 text-center">
            <span className="capitalize">
              {roadmapData?.created_by
                ? `${roadmapData.created_by.first_name} ${roadmapData.created_by.last_name}`
                : 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisRoadmapOn}&nbsp;
            {roadmapData?.created_at &&
              format(roadmapData.created_at, DateFormats.shortDate)}
          </p>
          <p className="text-sm text-gray-500 text-center">
            ({roadmapData?.courses?.length ?? 0} {en.contentRepository.courses},
            &nbsp;
            {roadmapData?.courses?.reduce(
              (acc, curr) => acc + (curr?.lessons_count ?? 0),
              0,
            ) ?? 0}{' '}
            {en.common.lessons}, &nbsp;
            {roadmapData?.users_count ?? 0} {en.common.participants})
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
          {hasCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              <CreateNewCard
                title={en.roadmapDetails.createNewCourse}
                onAdd={setOpenAddCourseModal}
              />
              {courses.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  description={item.description}
                  stats={`${item.lessons_count || 0} ${en.common.lessons}`}
                  link={`${RouteEnum.CONTENT}/${roadmap}/${item.id}`}
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
};

export default RoadmapDetails;
