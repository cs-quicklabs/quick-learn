import { FC, memo, useEffect } from 'react';
import { format } from 'date-fns';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { useDispatch } from 'react-redux';
import { setHideNavbar } from '@src/store/features/uiSlice';
import Breadcrumb from './Breadcrumb';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { TLesson } from '../types/contentRepository';
import { TBreadcrumb } from '../types/breadcrumbType';

// Separate components for better performance
const LessonHeader = memo(
  ({
    name,
    firstName,
    lastName,
    createdAt,
  }: {
    name: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string | Date;
  }) => (
    <div className="px-4 mb-8 text-center sm:px-6 lg:px-8">
      <div className="items-baseline">
        <h1 className="text-5xl font-extrabold leading-tight">{name}</h1>
        <p className="mt-1 ml-1 text-sm text-gray-500">
          {firstName} {lastName} {en.component.addLessonOn}{' '}
          {createdAt && format(new Date(createdAt), DateFormats.shortDate)}
        </p>
      </div>
    </div>
  ),
);

LessonHeader.displayName = 'LessonHeader';

const LessonContent = memo(({ content }: { content: string }) => (
  <article className="lesson-content flex mx-auto w-full max-w-5xl format format-sm sm:format-base lg:format-lg format-blue px-10 py-4 mb-8">
    <div
      className="lesson-viewer"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  </article>
));

LessonContent.displayName = 'LessonContent';

const ApprovalCheckbox = memo(
  ({
    isApproved,
    setIsApproved,
  }: {
    isApproved?: boolean;
    setIsApproved?: (value: boolean) => void;
  }) => (
    <div className="flex items-center p-16 mb-16 w-full max-w-5xl justify-center mx-auto">
      <input
        id="default-checkbox"
        type="checkbox"
        checked={isApproved}
        onChange={() => setIsApproved?.(true)}
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
  ),
);

ApprovalCheckbox.displayName = 'ApprovalCheckbox';

const PendingAlert = memo(() => (
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
));

PendingAlert.displayName = 'PendingAlert';

// Custom hook for navbar management
const useNavbarManagement = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHideNavbar(true));
    return () => {
      dispatch(setHideNavbar(false));
    };
  }, [dispatch]);
};

interface Props {
  lesson: TLesson;
  links: TBreadcrumb[];
  isApproved?: boolean;
  setIsApproved?: (value: boolean) => void;
  isPending?: boolean;
}

const ViewLesson: FC<Props> = ({
  lesson,
  isApproved,
  setIsApproved,
  links,
  isPending = false,
}) => {
  useNavbarManagement();

  // Ensure content is never undefined
  const content = lesson?.new_content || lesson?.content || '';

  return (
    <div className="-mt-8">
      <Breadcrumb links={links} />

      <LessonHeader
        name={lesson?.name}
        firstName={lesson?.created_by_user?.first_name}
        lastName={lesson?.created_by_user?.last_name}
        createdAt={lesson?.created_at}
      />

      <LessonContent content={content} />

      {setIsApproved && (
        <ApprovalCheckbox
          isApproved={isApproved}
          setIsApproved={setIsApproved}
        />
      )}

      {isPending && <PendingAlert />}
    </div>
  );
};

// Add display name and memoize the component
ViewLesson.displayName = 'ViewLesson';
export default memo(ViewLesson);
