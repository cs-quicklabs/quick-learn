/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RouteEnum } from '@src/constants/route.enum';
import { useSelector } from 'react-redux';
import {
  getFlaggedLessonDetails,
  markLessonAsUnFlagged,
} from '@src/apiServices/lessonsService';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useAppDispatch } from '@src/store/hooks';
import { setHideNavbar, selectUser } from '@src/store/features';
import { UserTypeIdEnum } from 'lib/shared/src';
import { PencilIcon } from '@heroicons/react/24/outline';

const defaultLinks = [{ name: 'Flagged Lessons', link: RouteEnum.FLAGGED }];

function LessonDetails() {
  const { lesson: id } = useParams<{ lesson: string }>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultLinks);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const isAdmin = useMemo<boolean>(() => {
    if (!user) return false;
    return [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
      user.user_type_id,
    );
  }, [user]);

  useEffect(() => {
    dispatch(setHideNavbar(true));
    return () => {
      dispatch(setHideNavbar(false));
    };
  }, [setHideNavbar]);

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<TLesson>();
  const [isFlagged, setIsFlagged] = useState<boolean>(false);

  useEffect(() => {
    if (!lesson) {
      setLinks(defaultLinks);
    } else {
      setLinks([
        ...defaultLinks,
        {
          name: lesson.course.name,
          link: `${RouteEnum.CONTENT}/courses/${lesson.course_id}`,
        },
        { name: lesson.name, link: `${RouteEnum.FLAGGED}/${lesson.id}` },
      ]);
    }
  }, [lesson]);

  useEffect(() => {
    if (isNaN(+id)) return;
    setLoading(true);
    getFlaggedLessonDetails(id)
      .then((res) => setLesson(res.data))
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(RouteEnum.FLAGGED);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function markAsUnFlagged(value: boolean) {
    if (isFlagged) return;
    setIsFlagged(value);
    setLoading(true);
    markLessonAsUnFlagged(id)
      .then((res) => showApiMessageInToast(res))
      .catch((err) => showApiErrorInToast(err))
      .finally(() => {
        setLoading(false);
        router.push(RouteEnum.FLAGGED);
      });
  }

  const editLink = () => {
    if (!lesson) return;

    if (lesson.approved) {
      // If lesson is approved, same link for all users
      router.push(
        `${RouteEnum.CONTENT}/courses/${lesson.course_id}/${lesson.id}`,
      );
    } else {
      router.push(
        `${RouteEnum.CONTENT}/courses/${lesson.course_id}/edit/${lesson.id}`,
      );
    }
  };

  if (!lesson) return null;

  return (
    <div className="-mt-8">
      {loading && <FullPageLoader />}
      <ViewLesson
        lesson={lesson}
        links={links}
        isFlagged={isAdmin && isFlagged}
        setIsFlagged={isAdmin ? markAsUnFlagged : undefined}
      />

      <button type="button" onClick={editLink}>
        <span className="fixed flex items-center bottom-4 right-4 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500">
          <PencilIcon className="flex-shrink-0 inline w-4 h-4 me-1" />| Edit
        </span>
      </button>
    </div>
  );
}

export default LessonDetails;
