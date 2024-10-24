import useDashboardStore from '@src/store/dashboard.store';
import { FC, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { TLesson } from '../types/contentRepository';
import { TBreadcrumb } from '../types/breadcrumbType';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

interface Props {
  lesson: TLesson;
  links: TBreadcrumb[];
  isApproved?: boolean;
  setIsApproved?: (value: boolean) => void;
  isPending?: boolean;
}

/**
 * A component to view a single lesson
 * @param {TLesson} lesson Lesson to be viewed
 * @param {boolean} isApproved Whether the lesson is approved or not
 * @param {((value: boolean) => void) | undefined} setIsApproved The function to set the approval status
 * @param {TBreadcrumb[]} links The breadcrumbs links
 * @param {boolean} isPending Whether the approval is pending or not
 * @returns {JSX.Element} The JSX element for the lesson view
 */
const ViewLesson: FC<Props> = ({
  lesson,
  isApproved,
  setIsApproved,
  links,
  isPending = false,
}) => {
  // For hidding navbar
  const { setHideNavbar } = useDashboardStore((state) => state);
  useEffect(() => {
    setHideNavbar(true);
    return () => {
      setHideNavbar(false);
    };
  }, [setHideNavbar]);

  return (
    <div className="-mt-8">
      <Breadcrumb links={links} />
      <div className="px-4 mb-8 text-center sm:px-6 lg:px-8">
        <div className="items-baseline">
          <h1 className="text-5xl font-extrabold leading-tight">
            {lesson?.name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500">
            {lesson?.created_by_user?.first_name}{' '}
            {lesson?.created_by_user?.last_name} added this lesson on{' '}
            {lesson?.created_at &&
              format(lesson.created_at, DateFormats.shortDate)}
          </p>
        </div>
      </div>
      <article className="lesson-content flex bg-white mx-auto w-full max-w-5xl format format-sm sm:format-base lg:format-lg format-blue px-10 py-4 shadow-md">
        <div
          className="lesson-viewer"
          dangerouslySetInnerHTML={{
            __html: lesson?.new_content || lesson?.content || '',
          }}
        />
      </article>
      {setIsApproved && (
        <div className="flex items-center p-16 mb-16 w-full max-w-5xl justify-center mx-auto">
          <input
            id="default-checkbox"
            type="checkbox"
            checked={isApproved}
            onChange={() => setIsApproved && setIsApproved(true)}
            disabled={isApproved}
            className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="default-checkbox"
            className="ms-4 text-2xl ml-4 font-semibold text-gray-900"
          >
            {en.approvals.approveThisLesson}
          </label>
        </div>
      )}
      {isPending && (
        <div className="flex items-center p-16 mb-16 w-full max-w-5xl justify-center mx-auto">
          <div
            className="flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
            role="alert"
          >
            <InformationCircleIcon className="flex-shrink-0 inline w-4 h-4 me-3" />
            <div className="text-xl">
              <span className="font-medium text-lg">
                {en.approvals.approvalPendingExclamation}
              </span>{' '}
              {en.approvals.approvalPendingInfo}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLesson;
