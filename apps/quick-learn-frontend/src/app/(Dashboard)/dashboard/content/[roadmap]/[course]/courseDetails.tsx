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
import useDashboardStore from '@src/store/dashboard.store';
import { HTMLSanitizer } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CourseDetailsSkeleton from './CourseDetailsSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

const CourseDetails = () => {
  const router = useRouter();
  const { setContentRepositoryMetadata, metadata } = useDashboardStore(
    (state) => state,
  );
  const allCourseCategories = metadata.contentRepository.course_categories;
  const allRoadmapCategories = metadata.contentRepository.roadmap_categories;
  const params = useParams<{ roadmap: string; course: string }>();
  const courseId = params.course;
  const roadmapId = params.roadmap;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [courseData, setcourseData] = useState<TCourse>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [openAssignModal, SetOpenAssignModal] = useState<boolean>(false);
  const [roadmapCategoriesData, setRoadmapCategoriesData] = useState<
    TAssignModalMetadata[]
  >([]);
  const [showConformationModal, setShowConformationModal] =
    useState<boolean>(false);

  const getCourseDetails = useCallback(() => {
    if (!courseId) return;
    setIsPageLoading(true);
    getCourse(courseId)
      .then((res) => {
        setcourseData(res.data);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      })
      .finally(() => setIsPageLoading(false));
  }, [courseId]);

  useEffect(() => {
    getCourseDetails();
  }, [getCourseDetails]);

  useEffect(() => {
    const data = allRoadmapCategories.map((item) => {
      return {
        name: item.name,
        list: item.roadmaps.map((course) => {
          return {
            name: course.name,
            value: Number(course.id),
          };
        }),
      };
    });
    setRoadmapCategoriesData(data);
  }, [allRoadmapCategories]);

  useEffect(() => {
    if (!courseData) return;
    if (
      courseData.roadmaps?.length &&
      courseData.roadmaps?.length > 0 &&
      parseInt(roadmapId)
    ) {
      const roadmap = courseData.roadmaps.find(
        (ele) => parseInt(ele.id) === parseInt(roadmapId),
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
        setcourseData({ ...courseData, ...data });
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  function assignRoadmaps(data: string[]) {
    setIsLoading(true);
    assignRoadmapsToCourse(courseId, data)
      .then((res) => {
        showApiMessageInToast(res);
        SetOpenAssignModal(false);
        getCourseDetails();
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  function onArchive() {
    setIsLoading(true);
    activateCourse({ id: Number(courseId), active: false })
      .then((res) => {
        showApiMessageInToast(res);
        allCourseCategories.forEach((item) => {
          item.courses = item.courses.filter((ele) => ele.id !== courseId);
        });
        setContentRepositoryMetadata({
          ...metadata.contentRepository,
          course_categories: allCourseCategories,
        });
        if (roadmapId && parseInt(roadmapId)) {
          router.replace(RouteEnum.CONTENT + `/${roadmapId}`);
        } else {
          router.replace(RouteEnum.CONTENT);
        }
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

  const hasLessons = courseData?.lessons && courseData.lessons.length > 0;

  return (
    <>
      <AddEditCourseModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        isAdd={false}
        onSubmit={onEdit}
        isloading={isloading}
        initialData={courseData}
      />
      <AssignDataModal
        show={openAssignModal}
        setShow={SetOpenAssignModal}
        heading={en.courseDetails.addExistingRoadmaps}
        sub_heading={en.common.selectRoadmaps}
        isLoading={isloading}
        data={roadmapCategoriesData}
        initialValues={{
          selected: courseData?.roadmaps?.map((item) => String(item.id)) || [],
        }}
        onSubmit={assignRoadmaps}
      />
      <ConformationModal
        title={en.courseDetails.archiveConfirmHeading}
        subTitle={en.courseDetails.archiveConfirmSubHeading}
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={onArchive}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb links={links} />

        {/* Course Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold capitalize mb-2">
            {courseData?.name}
          </h1>
          <p className="text-sm text-gray-500 text-center">
            <span className="capitalize">
              {courseData?.created_by
                ? `${courseData.created_by.first_name} ${courseData.created_by.last_name}`
                : 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisRoadmapOn}&nbsp;
            {courseData?.created_at &&
              format(courseData.created_at, DateFormats.shortDate)}
          </p>
          <p className="text-sm text-gray-500 text-center">
            ({courseData?.lessons?.length ?? 0} {en.common.lessons}, &nbsp;
            {courseData?.users_count ?? 0} {en.common.participants})
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
                onClick={() => SetOpenAssignModal(true)}
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
          {hasLessons ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
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
};

export default CourseDetails;
