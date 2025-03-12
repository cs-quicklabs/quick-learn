'use client';
import { getCourse } from '@src/apiServices/contentRepositoryService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Card from '@src/shared/components/Card';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TCourse } from '@src/shared/types/contentRepository';
import { useSelector } from 'react-redux';
import { selectAllCourses } from '@src/store/features/roadmapsSlice';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CourseDetailsSkeleton from './courseDetailSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { HTMLSanitizer } from '@src/utils/helpers';
import ArchivedDialogbox from '@src/shared/components/ArchivedDialogBox';
import { useAppDispatch } from '@src/store/hooks';
import {
  activateArchivedCourse,
  deleteArchivedCourse,
} from '@src/store/features';
import { toast } from 'react-toastify';
import ConformationModal from '@src/shared/modals/conformationModal';

const defaultlinks: TBreadcrumb[] = [
  {
    name: en.contentRepository.archiveCourse,
    link: RouteEnum.ARCHIVED_COURSES,
  },
];

function CourseDetails() {
  const params = useParams<{ roadmap: string; course: string }>();
  const courseId = params.course;
  const roadmapId = params.roadmap;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [restoreId, setRestoreId] = useState<string | false>(false);
  const [deleteId, setDeleteId] = useState<string | false>(false);

  // Selectors
  const allCourses = useSelector(selectAllCourses);
  const courseFromStore = allCourses.find((course) => course.id === +courseId);

  const [isPageLoading, setIsPageLoading] = useState(!courseFromStore);
  const [courseData, setCourseData] = useState<TCourse | undefined>(
    courseFromStore,
  );
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);

  const handleDeleteCourse = async (id: string) => {
    try {
      await dispatch(deleteArchivedCourse({ id: parseInt(id, 10) })).unwrap();
      toast.success(en.archivedSection.courseDeleted);
      router.push(RouteEnum.ARCHIVED_COURSES);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      setDeleteId(false);
    }
  };

  const restoreCourse = async (id: string) => {
    try {
      await dispatch(activateArchivedCourse({ id: parseInt(id, 10) })).unwrap();
      toast.success(en.archivedSection.courseRestored);
      router.push(RouteEnum.ARCHIVED_COURSES);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      setRestoreId(false);
    }
  };

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
          link: `${RouteEnum.ARCHIVED_COURSES}/${roadmap.id}`,
        },
        {
          name: courseData.name,
          link: `${RouteEnum.ARCHIVED_COURSES}/${roadmapId}/${courseData.id}`,
        },
      ]);
    } else {
      setLinks([
        ...defaultlinks,
        {
          name: courseData.name,
          link: `${RouteEnum.ARCHIVED_COURSES}/courses/${courseData.id}`,
        },
      ]);
    }
  }, [courseData, roadmapId]);

  if (isPageLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (!courseData) {
    return null;
  }

  const hasLessons = courseData.lessons && courseData.lessons.length > 0;

  return (
    <>
      <ConformationModal
        title={
          restoreId
            ? en.archivedSection.confirmActivateCourse
            : en.archivedSection.confirmDeleteCourse
        }
        subTitle={
          restoreId
            ? en.archivedSection.confirmActivateCourseSubtext
            : en.archivedSection.confirmDeleteCourseSubtext
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be set true
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId
            ? restoreCourse(restoreId)
            : deleteId && handleDeleteCourse(deleteId)
        }
      />
      <div className="flex flex-col items-center">
        <ArchivedDialogbox
          type="Course"
          archivedBy={
            courseData.updated_by
              ? `${courseData.updated_by.first_name} ${courseData.updated_by.last_name}`
              : 'unknown'
          }
          archivedAt={courseData.updated_at}
          onRestore={() => setRestoreId(courseId)} // Show confirmation modal for restore
          onDelete={() => setDeleteId(courseId)}
        />
      </div>

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
            {courseData.description}
          </p>
          <p className="text-sm text-gray-500 text-center">
            {courseData.is_community_available
              ? 'This course is community available'
              : ''}
          </p>
          <p className="text-sm text-gray-500 text-center">
            ({courseData.lessons?.length ?? 0} {en.common.lessons}, &nbsp;
            {courseData.userCount ?? 0} {en.common.participants})
          </p>
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
                    metadata={{
                      addedBy: created_by_user
                        ? `${created_by_user.first_name} ${created_by_user.last_name}`
                        : undefined,
                      date: format(created_at, DateFormats.shortDate),
                    }}
                    stats={!approved ? en.lesson.pendingApproval : undefined}
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
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
