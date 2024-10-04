'use client';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import {
  ArrowRightEndOnRectangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  archiveCourse,
  assignRoadmapsToCourse,
  getCourse,
  updateCourse,
} from '@src/apiServices/contentRepositoryService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import { FullPageLoader } from '@src/shared/components/UIElements';
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
    archiveCourse(courseId)
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

  function onEditLesson(id: number) {
    router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}/${id}`);
  }

  return (
    <>
      {isPageLoading && <FullPageLoader />}
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
      <div>
        <Breadcrumb links={links} />
        <div className="items-baseline mb-8">
          <h1 className="text-center text-5xl font-extrabold leading-tight capitalize">
            {courseData?.name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
            <span className="capitalize">
              {courseData?.created_by?.full_name ?? 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisRoadmapOn}&nbsp;
            {courseData?.created_at &&
              format(courseData?.created_at, DateFormats.shortDate)}
          </p>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
            ({courseData?.lessons_count ?? 0} {en.common.lessons}, &nbsp;
            {courseData?.users_count ?? 0} {en.common.participants})
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Tooltip
              content={en.contentRepository.editCourse}
              trigger="hover"
              className="py-2 px-3 max-w-sm text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip"
            >
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setOpenAddModal(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip
              content={en.contentRepository.assignToRoadmap}
              trigger="hover"
              className="py-2 px-3 max-w-sm text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip"
            >
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => SetOpenAssignModal(true)}
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip
              content={en.contentRepository.archiveCourse}
              trigger="hover"
              className="py-2 px-3 max-w-sm text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip"
            >
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
      </div>
      <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
        <div id="created-spaces">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            <li>
              <CreateNewCard
                title={en.lesson.createNewLesson}
                onAdd={onAddLesson}
              />
            </li>
            {courseData?.lessons?.map(
              ({
                name,
                content,
                new_content,
                approved,
                created_by_user,
                created_at,
                id,
              }) => (
                <button
                  type="button"
                  key={id}
                  disabled={!approved}
                  onClick={() => onEditLesson(id)}
                  className="text-left inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <div className="flex-wrap py-4 px-6 text-gray-900 h-40">
                    <h1
                      id="message-heading"
                      className="font-medium text-gray-900 line-clamp-2 group-hover:underline capitalize"
                    >
                      {name}
                    </h1>
                    <p className="font-normal text-sm text-gray-500 line-clamp-2 mt-2">
                      {HTMLSanitizer(approved ? content : new_content)}
                    </p>
                    <p className="inline-flex align-center font-normal text-xs text-gray-500 line-clamp-2 mt-4 pb-2 capitalize">
                      {approved ? (
                        'Added by ' +
                        created_by_user.full_name +
                        ' on ' +
                        format(created_at, DateFormats.shortDate)
                      ) : (
                        <>
                          <ExclamationTriangleIcon
                            className="text-yellow-500 mr-1"
                            height={16}
                            width={16}
                          />{' '}
                          {en.lesson.pendingApproval}
                        </>
                      )}
                    </p>
                  </div>
                </button>
              ),
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
