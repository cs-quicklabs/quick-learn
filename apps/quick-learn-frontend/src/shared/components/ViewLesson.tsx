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
import { FlagIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { CheckboxIcon } from './UIElements';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
});

// Separate components for better performance
const LessonHeader = memo(
  ({
    name,
    full_name,
    createdAt,
    showCreatedBy,
  }: {
    name: string;
    full_name: string;
    createdAt?: string | Date;
    showCreatedBy?: boolean;
  }) => (
    <div className="px-4 mb-4 text-center sm:px-6 md:mb-8 lg:px-8">
      <div className="items-baseline">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight first-letter:uppercase mb-3">
          {name}
        </h1>
        {showCreatedBy && (
          <p className="mt-1 ml-1 text-sm text-gray-500">
            {full_name} {en.component.addLessonOn}{' '}
            {createdAt && format(new Date(createdAt), DateFormats.shortDate)}
          </p>
        )}
      </div>
    </div>
  ),
);

LessonHeader.displayName = 'LessonHeader';

const LessonContent = memo(({ content }: { content: string }) => {
  // Configure modules without toolbar
  const modules = {
    toolbar: false, // This disables the toolbar
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <article className="flex mx-auto w-full max-w-5xl format format-sm format-blue px-4 pt-0 pb-4 mb-4 sm:format-base md:px-10 md:pt-4 md:mb-8 lg:format-lg">
      <div className="quill-content-display w-full">
        <ReactQuill
          value={content}
          readOnly
          theme="snow"
          modules={modules}
          className="w-full"
        />
      </div>
    </article>
  );
});

LessonContent.displayName = 'LessonContent';

const ApprovalCheckbox = memo(
  ({
    value,
    setValue,
    text = en.approvals.approveThisLesson,
  }: {
    value?: boolean;
    setValue?: (value: boolean) => void;
    text?: string;
  }) => (
    <div className="flex items-center md:items-start p-16 mb-16 w-full max-w-5xl justify-center mx-auto">
      <div className="group grid size-5 grid-cols-1 md:grid-cols-2 text-center">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={value}
          onChange={() => setValue?.(true)}
          disabled={value}
          className="appearance-none h-6 w-6 md:h-8 md:w-8 rounded-sm border border-gray-300 bg-white checked:border-primary-600 checked:bg-primary-600 indeterminate:border-primary-600 indeterminate:bg-primary-600 focus:outline-2 focus:outline-offset-1 focus:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
        />
        <CheckboxIcon className="size-6" />
      </div>

      <label
        htmlFor="default-checkbox"
        className="ms-3 md:ms-7 sm:text-xl md:text-2xl font-semibold text-gray-900"
      >
        {text}
      </label>
    </div>
  ),
);

ApprovalCheckbox.displayName = 'ApprovalCheckbox';

const PendingAlert = memo(() => (
  <div className="flex items-center my-5 w-full lg:w-1/2 justify-center mx-auto">
    <div
      className="flex items-center p-4 mb-4 w-full text-sm text-yellow-800 rounded-lg bg-yellow-50"
      role="alert"
    >
      <InformationCircleIcon className="shrink-0 inline w-4 h-4 me-3" />
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
  showCreatedBy?: boolean;
  disableLink?: boolean;
  isFlagged?: boolean;
  setIsFlagged?: (value: boolean) => void;
}

const ViewLesson: FC<Props> = ({
  lesson,
  isApproved,
  setIsApproved,
  isFlagged,
  setIsFlagged,
  links,
  isPending = false,
  showCreatedBy = true,
  disableLink = false,
}) => {
  useNavbarManagement();

  // Ensure content is never undefined
  const content = lesson?.new_content || lesson?.content || '';

  return (
    <div className="-mt-8">
      <Breadcrumb links={links} disabled={disableLink} />
      <div>
        <LessonHeader
          name={lesson?.name}
          full_name={lesson?.created_by_user?.display_name ?? 'Admin'}
          createdAt={lesson?.created_at}
          showCreatedBy={showCreatedBy}
        />

        <LessonContent content={content} />

        {setIsApproved && (
          <ApprovalCheckbox value={isApproved} setValue={setIsApproved} />
        )}

        {setIsFlagged && (
          <div className="mx-4">
            <div className="mx-auto max-w-fit flex items-center gap-2 rounded-md bg-yellow-100 p-5 text-yellow-800">
              <div className="h-5 w-5">
                <FlagIcon />
              </div>
              {`${en.approvals.lessonFlaggedBy} ${
                lesson?.flagged_lesson?.user?.display_name ??
                `${en.common.unknown}`
              } ${en.common.on} ${format(
                lesson?.flagged_lesson?.flagged_on ?? Date.now(),
                DateFormats.shortDate,
              )}`}
            </div>
            <ApprovalCheckbox
              value={isFlagged}
              setValue={setIsFlagged}
              text={en.approvals.unFlagThisLesson}
            />
          </div>
        )}

        {isPending && <PendingAlert />}
      </div>
    </div>
  );
};

// Add display name and memoize the component
ViewLesson.displayName = 'ViewLesson';
export default memo(ViewLesson);
