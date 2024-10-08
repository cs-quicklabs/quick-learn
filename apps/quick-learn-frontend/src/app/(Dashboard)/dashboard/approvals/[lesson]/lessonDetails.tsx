'use client';

import {
  approveLesson,
  getLessonDetails,
} from '@src/apiServices/lessonsService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson } from '@src/shared/types/contentRepository';
import useDashboardStore from '@src/store/dashboard.store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const defaultLinks = [{ name: 'Approvals', link: RouteEnum.APPROVALS }];

const LessonDetails = () => {
  const { lesson: id } = useParams<{ lesson: string }>();
  // For hidding navbar
  const { setHideNavbar } = useDashboardStore((state) => state);
  useEffect(() => {
    setHideNavbar(true);
    return () => {
      setHideNavbar(false);
    };
  }, [setHideNavbar]);

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<TLesson>();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const links = useMemo<TBreadcrumb[]>(
    () =>
      !lesson
        ? defaultLinks
        : [
            ...defaultLinks,
            { name: lesson.name, link: `${RouteEnum.APPROVALS}/${lesson.id}` },
          ],
    [lesson],
  );

  useEffect(() => {
    if (isNaN(+id)) return;
    setLoading(true);
    getLessonDetails(id, false)
      .then((res) => {
        setLesson(res.data);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setLoading(false));
  }, [id]);

  function changeApproved() {
    if (isApproved) return;
    setLoading(true);
    setIsApproved(true);
    approveLesson(id)
      .then((res) => showApiMessageInToast(res))
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setLoading(false));
  }

  return (
    <div className="-mt-8">
      {loading && <FullPageLoader />}
      <Breadcrumb links={links} />
      <div className="px-4 mb-8 text-center sm:px-6 lg:px-8">
        <div className="items-baseline">
          <h1 className="text-5xl font-extrabold leading-tight">
            {lesson?.name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500">
            {lesson?.created_by_user?.full_name} added this lesson on{' '}
            {lesson?.created_at &&
              format(lesson.created_at, DateFormats.shortDate)}
          </p>
        </div>
      </div>
      <article className="lesson-content flex bg-white justify-center mx-auto w-full max-w-5xl format format-sm sm:format-base lg:format-lg format-blue px-10 py-4 max-w-5xl shadow shadow-md">
        <div
          className="lesson-viewer"
          dangerouslySetInnerHTML={{
            __html: lesson?.new_content || lesson?.content || '',
          }}
        />
      </article>
      <div className="flex items-center p-16 mb-16 w-full max-w-5xl justify-center mx-auto">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={isApproved}
          onChange={() => changeApproved()}
          disabled={loading || isApproved}
          className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="default-checkbox"
          className="ms-4 text-2xl ml-4 font-semibold text-gray-900"
        >
          {en.approvals.approveThisLesson}
        </label>
      </div>
    </div>
  );
};

export default LessonDetails;
