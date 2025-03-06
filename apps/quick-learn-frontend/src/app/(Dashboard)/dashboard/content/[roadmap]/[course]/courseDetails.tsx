'use client';
import {
  ArrowRightEndOnRectangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { activateCourse } from '@src/apiServices/archivedService';
import {
  assignRoadmapsToCourse,
  getCourse,
  updateCourse,
} from '@src/apiServices/contentRepositoryService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import AddEditCourseModal from '@src/shared/modals/addEditCourseModal';
import AssignDataModal from '@src/shared/modals/assignDataModal';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import {
  TAssignModalMetadata,
  TCourse,
  TCreateCourse,
} from '@src/shared/types/contentRepository';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllCourses,
  updateRoadmap,
  selectRoadmapById,
} from '@src/store/features/roadmapsSlice';
import {
  selectContentRepositoryMetadata,
  updateContentRepository,
  updateContentRepositoryRoadmapCount,
} from '@src/store/features/metadataSlice';
import { AppDispatch } from '@src/store/store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CourseDetailsSkeleton from './CourseDetailsSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { HTMLSanitizer } from '@src/utils/helpers';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

function CourseDetails() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{ roadmap: string; course: string }>();
  const courseId = params.course;
  const roadmapId = params.roadmap;

  // Selectors
  const allCourses = useSelector(selectAllCourses);
  const courseFromStore = allCourses.find((course) => course.id === +courseId);
  const roadmapFromStore = useSelector(
    selectRoadmapById(parseInt(roadmapId, 10)),
  );
  const contentRepositoryMetadata = useSelector(
    selectContentRepositoryMetadata,
  );
  const allCourseCategories = contentRepositoryMetadata.course_categories;
  const allRoadmapCategories = contentRepositoryMetadata.roadmap_categories;

  const [isPageLoading, setIsPageLoading] = useState(!courseFromStore);
  const [courseData, setCourseData] = useState<TCourse | undefined>(
    courseFromStore,
  );
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState<boolean>(false);
  const [roadmapCategoriesData, setRoadmapCategoriesData] = useState<
    TAssignModalMetadata[]
  >([]);
  const [showConformationModal, setShowConformationModal] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const res = await getCourse(courseId);
        setCourseData(res.data);
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, courseFromStore]);

  useEffect(() => {
    const data = allRoadmapCategories
      .filter((category) => category.roadmaps.length > 0)
      .map((item) => ({
        name: item.name,
        list: item.roadmaps.map((course) => ({
          name: course.name,
          value: Number(course.id),
        })),
      }));
    setRoadmapCategoriesData(data);
  }, [allRoadmapCategories]);

  useEffect(() => {
    if (!courseData) return;
    if (
      courseData.roadmaps?.length &&
      courseData.roadmaps?.length > 0 &&
      parseInt(roadmapId, 10)
    ) {
      const roadmap = courseData.roadmaps.find(
        (ele) => ele.id === parseInt(roadmapId, 10),
      );
      if (!roadmap) return;
      setLinks([
        ...defaultlinks,
        {
          name: roadmap.name,
          link: `${RouteEnum.CONTENT}/${roadmap.id}`,
        },
        {
          name: courseData.name,
          link: `${RouteEnum.CONTENT}/${roadmapId}/${courseData.id}`,
        },
      ]);
    } else {
      setLinks([
        ...defaultlinks,
        {
          name: courseData.name,
          link: `${RouteEnum.CONTENT}/courses/${courseData.id}`,
        },
      ]);
    }
  }, [courseData, roadmapId]);

  function onEdit(data: TCreateCourse) {
    setIsLoading(true);
    updateCourse(courseId, data)
      .then((res) => {
        setOpenAddModal(false);
        if (!courseData) return;

        const updatedCourse = { ...courseData, ...data };
        setCourseData(updatedCourse);

        // Update course in roadmap if we're in roadmap context
        if (roadmapFromStore && roadmapId) {
          const updatedRoadmap = {
            ...roadmapFromStore,
            courses: roadmapFromStore.courses.map((c) =>
              c.id === +courseId ? updatedCourse : c,
            ),
          };
          dispatch(updateRoadmap(updatedRoadmap));
        }

        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  const handleUpdateContentRepoRoadmapcount = (data: string[]) => {
    if (!courseData) return;
    dispatch(
      updateContentRepositoryRoadmapCount([
        {
          id: String(courseData.id),
          action:
            data.length -
            (courseData.roadmaps ? courseData.roadmaps.length : 0),
        },
      ]),
    );
  };

  function assignRoadmaps(data: string[]) {
    setIsLoading(true);
    assignRoadmapsToCourse(courseId, data)
      .then((res) => {
        showApiMessageInToast(res);
        setOpenAssignModal(false);
        handleUpdateContentRepoRoadmapcount(data);

        // Check if the current roadmap is still assigned
        const isCurrentRoadmapAssigned = data.includes(roadmapId);

        if (!isCurrentRoadmapAssigned && roadmapId) {
          router.replace(`${RouteEnum.CONTENT}/${roadmapId}`);
        } else {
          // Refresh course data to get updated roadmaps
          getCourse(courseId).then((res) => {
            setCourseData(res.data);
          });
        }
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  function onArchive() {
    setIsLoading(true);
    activateCourse({ id: Number(courseId), active: false })
      .then((res) => {
        showApiMessageInToast(res);

        // Update metadata
        const updatedCourseCategories = allCourseCategories.map((category) => ({
          ...category,
          courses: category.courses.filter((course) => course.id !== +courseId),
        }));

        dispatch(
          updateContentRepository({
            course_categories: updatedCourseCategories,
          }),
        );

        // Update roadmap if in roadmap context
        if (roadmapFromStore && roadmapId) {
          const updatedRoadmap = {
            ...roadmapFromStore,
            courses: roadmapFromStore.courses.filter((c) => c.id !== +courseId),
          };
          dispatch(updateRoadmap(updatedRoadmap));
        }

        router.push(RouteEnum.CONTENT);

        setShowConformationModal(false);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  function onAddLesson() {
    router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}/add`);
  }

  if (isPageLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (!courseData) {
    return null;
  }

  const hasLessons = courseData.lessons && courseData.lessons.length > 0;

  return (
    <>
      <AddEditCourseModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        isAdd={false}
        onSubmit={onEdit}
        isloading={isLoading}
        initialData={courseData}
      />

      {openAssignModal && (
        <AssignDataModal
          show={openAssignModal}
          setShow={setOpenAssignModal}
          heading={en.courseDetails.addExistingRoadmaps}
          sub_heading={en.common.selectRoadmaps}
          isLoading={isLoading}
          data={roadmapCategoriesData}
          initialValues={{
            selected: courseData.roadmaps?.map((item) => String(item.id)) || [],
          }}
          onSubmit={assignRoadmaps}
        />
      )}

      <ConformationModal
        title={en.courseDetails.archiveConfirmHeading}
        subTitle={en.courseDetails.archiveConfirmSubHeading}
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={onArchive}
      />

      <Breadcrumb links={links} />
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl text-center md:text-5xl font-bold first-letter:uppercase mb-2">
            {courseData.name}
          </h1>
          <p className="text-sm text-gray-500 text-center">
            <span className="capitalize">
              {courseData.created_by
                ? `${courseData.created_by.first_name} ${courseData.created_by.last_name}`
                : 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisCourseOn}&nbsp;
            {courseData.created_at &&
              format(courseData.created_at, DateFormats.shortDate)}
          </p>
          <p className="text-sm text-gray-500 text-center">
            ({courseData.lessons?.length ?? 0} {en.common.lessons}, &nbsp;
            {courseData.userCount ?? 0} {en.common.participants})
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Tooltip content={en.contentRepository.editCourse}>
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setOpenAddModal(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </Tooltip>

            <Tooltip content={en.contentRepository.assignToRoadmap}>
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setOpenAssignModal(true)}
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              </button>
            </Tooltip>

            <Tooltip content={en.contentRepository.archiveCourse}>
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

        {/* Lessons Section */}
        <div className="px-4">
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {en.contentRepository.allLesson}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({courseData.lessons?.length ?? 0} {en.common.lessons})
            </p>
          </div>
          {hasLessons ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              <CreateNewCard
                title={en.lesson.createNewLesson}
                onAdd={onAddLesson}
              />
              {courseData.lessons?.map(
                ({
                  name,
                  content,
                  new_content,
                  approved,
                  created_by_user,
                  created_at,
                  id,
                }) => (
                  <Card
                    key={id}
                    id={id.toString()}
                    title={name}
                    description={HTMLSanitizer(
                      (approved && content) || new_content || content,
                    )}
                    link={`${RouteEnum.CONTENT}/${roadmapId}/${courseId}/${
                      approved ? id : `view/${id}`
                    }`}
                    metadata={{
                      addedBy: created_by_user
                        ? `${created_by_user.first_name} ${created_by_user.last_name}`
                        : undefined,
                      date: format(created_at, DateFormats.shortDate),
                    }}
                    stats={!approved ? en.lesson.pendingApproval : undefined}
                    className={approved ? '' : 'bg-gray-100'}
                    showWarning={!approved}
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyState
              type="lessons"
              customTitle={en.lesson.notfound}
              customDescription="Create first lesson to get started"
              actionButton={{
                label: en.lesson.createNewLesson,
                onClick: onAddLesson,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
