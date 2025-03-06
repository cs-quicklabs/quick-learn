'use client';
import {
  flagLesson,
  getDailyLessionDetail,
  markAsDonePublic,
} from '@src/apiServices/lessonsService';
import { TFlaggedLesson, TLesson } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
  showErrorMessage,
} from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TUser } from '@src/shared/types/userTypes';
import { HomeIcon } from '@heroicons/react/20/solid';
import { FlagIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { UserTypeIdEnum } from 'lib/shared/src';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';

function DailyLessonDetail() {
  const [link, setLink] = useState<TBreadcrumb[]>([]);
  const router = useRouter();
  const [lessonDetails, setLessonDetails] = useState<TLesson>();
  const [userDetail, setUserDetail] = useState<TUser>();
  const [isChecked, setIsChecked] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [completedOn, setCompletedOn] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<TFlaggedLesson | null>(null);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);

  const { token } = useParams<{
    token: string;
  }>();

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!lessonDetails) return;
    const { checked } = event.target;
    setIsChecked(checked);
    try {
      const res = await markAsDonePublic(
        lessonDetails.id,
        lessonDetails?.course_id,
        true,
        Number(userDetail?.id),
      );
      showApiMessageInToast(res);
      setIsRead(res.data.isRead);
      setCompletedOn(res.data.completed_date);
      setIsChecked(res.data.isRead);
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  const handleFlagLesson = async () => {
    if (!token || !lessonDetails) {
      showErrorMessage('Missing required information');
      return;
    }
    setIsFlagging(true);
    flagLesson(token)
      .then((res) => {
        showApiMessageInToast(res);
        setIsFlagged({
          flagged_on: new Date(),
          user: userDetail,
          user_id: Number(userDetail?.id) || 1,
          lesson_id: Number(lessonDetails.id),
          course_id: Number(lessonDetails?.course_id),
          id: 1, // dummy id
        });
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsFlagging(false));
  };

  const markLessionAsUnread = async () => {
    if (!lessonDetails) return;
    markAsDonePublic(
      lessonDetails.id,
      lessonDetails.course_id,
      false,
      Number(userDetail?.id),
    )
      .then((res) => {
        showApiMessageInToast(res);
        setIsRead(false);
        setIsChecked(false);
      })
      .catch((err) => {
        console.error('Error marking lesson as completed:', err);
        showApiErrorInToast(err);
      });
  };

  useEffect(() => {
    if (!token) return;
    getDailyLessionDetail(token)
      .then(({ data }) => {
        const { lesson_detail, user_detail, user_lesson_read_info } = data;
        const { user_type_id } = user_detail;
        // lesson and admin details
        setLessonDetails(lesson_detail);
        setUserDetail(user_detail);

        // breadcrumb
        setLink([
          {
            name: lesson_detail?.course?.name ?? 'Course',
            link: '#',
          },
          {
            name: lesson_detail.name,
            link: '#',
          },
        ]);

        // lesson flagged details
        setIsFlagged(lesson_detail?.flagged_lesson ?? null);
        //
        setIsAdmin(
          [UserTypeIdEnum.ADMIN, UserTypeIdEnum.SUPERADMIN].includes(
            user_type_id,
          ),
        );
        // lesson read status
        setIsRead(user_lesson_read_info.isRead);
        setCompletedOn(user_lesson_read_info.completed_date);
        setIsChecked(user_lesson_read_info.isRead);
      })
      .catch((err) => {
        showApiErrorInToast(err);
        router.replace(RouteEnum.LOGIN);
      });
  }, [token, router]);

  const navigateUserToLearningPath = () => {
    router.replace(RouteEnum.LOGIN);
  };

  const renderLessonCompletionStatus = () => {
    if (isRead) {
      return (
        <div className="w-full flex align-middle justify-center">
          <p className="bg-green-100 p-5 rounded-md text-[#166534] flex justify-center items-center gap-2 my-5 mx-2 w-full lg:w-1/2 text-start">
            <span className="text-[#166534] flex bg-white rounded-full w-5 h-5 aspect-square font-bold items-center justify-center">
              <InformationCircleIcon />
            </span>
            <p>
              <span className="font-bold">
                {en.myLearningPath.alreadyCompleted}
              </span>{' '}
              {completedOn && en.myLearningPath.lessonCompleted(completedOn)}{' '}
              <button
                type="button"
                className="font-bold underline cursor-pointer"
                onClick={markLessionAsUnread}
              >
                {en.myLearningPath.markAsUnread}
              </button>
            </p>
          </p>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mb-12 mt-0 md:mt-6">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="rounded-md h-5 w-5 border-gray-400 bg-[#F4F4F6]"
        />
        <p className="text-l font-semibold text-gray-900 dark:text-gray-300">
          {en.myLearningPath.markRead}
        </p>
      </div>
    );
  };

  const renderAdminControls = () => {
    if (!isAdmin) return null;

    function renderFlaggedBy() {
      if (isFlagging) return 'Flagging...';

      if (isFlagged) {
        return (
          <div className="flex items-center gap-2 rounded-md bg-yellow-100 p-5 text-yellow-800">
            <div className="h-5 w-5">
              <FlagIcon />
            </div>
            {`${en.approvals.lessonFlaggedBy} ${
              isFlagged?.user?.display_name ?? `${en.common.unknown}`
            } ${en.common.on} ${format(
              isFlagged.flagged_on,
              DateFormats.shortDate,
            )}`}
          </div>
        );
      }

      return (
        <button
          type="button"
          className="inline-flex justify-center items-center p-2 text-xs hover:underline font-medium rounded-lg text-gray-700 sm:text-sm hover:bg-gray-100"
          onClick={handleFlagLesson}
          disabled={isFlagged ?? isFlagging}
        >
          {en.approvals.flagLesson}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center my-5 mx-2">
        {renderFlaggedBy()}
      </div>
    );
  };

  const renderNavigationButton = () => {
    if (!token) return null;

    return (
      <div className="fixed flex bottom-5 left-5">
        <button
          type="button"
          onClick={navigateUserToLearningPath}
          className="flex items-center gap-1 bg-[#1D4ED8] text-white px-4 py-2 rounded-full dark:bg-blue-700 transition-colors"
        >
          <HomeIcon height="1rem" width="1rem" />
          <span className="hidden md:flex">
            {en.lesson.NavigateToLearningPath}
          </span>
        </button>
      </div>
    );
  };

  if (!lessonDetails) return <FullPageLoader />;

  return (
    <div className="max-w-screen-2xl mx-auto mt-12 py-3 mb-12 sm:py-5 md:mb-0">
      <ViewLesson
        lesson={lessonDetails}
        links={link}
        showCreatedBy={false}
        disableLink
      />
      {renderLessonCompletionStatus()}
      {renderAdminControls()}
      {renderNavigationButton()}
    </div>
  );
}

export default DailyLessonDetail;
