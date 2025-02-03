'use client';
import {
  getDailyLessionDetail,
  getFlaggedLessons,
  getLessonStatusPublic,
  markAsDonePublic,
} from '@src/apiServices/lessonsService';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';
import ViewLesson from '@src/shared/components/ViewLesson';
import { Button } from 'flowbite-react';
import { TUser } from '@src/shared/types/userTypes';
import { HomeIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { UserTypeIdEnum } from 'lib/shared/src';
import { FlaggedLesson } from '@src/shared/types/utilTypes';

const DailyLessonDetail = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState('');
  const [token, setToken] = useState('');
  const [lessonDetails, setLessonDetails] = useState<TLesson>();
  const [userDetail, setUserDetail] = useState<TUser>();
  const [isChecked, setIsChecked] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [completedOn, setCompletedOn] = useState<string>('');
  const [isAdmins, setIsAdmins] = useState<boolean>(false);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);
  const [flaggedDetails, setFlaggedDetails] = useState<{
    whoFlagged: string;
    whenFlagged: string;
  } | null>(null);

  const { lesson } = useParams<{
    lesson: string;
  }>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCourseId(params.get('course_id') || '');
      setToken(params.get('token') || '');
    }
  }, []);

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    try {
      const res = await markAsDonePublic(
        lesson,
        courseId,
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
    if (!userDetail?.id || !courseId || !lesson) {
      showApiErrorInToast('Missing required information');
      return;
    }

    setIsFlagging(true);
    const lessonId = parseInt(lesson, 10);
    const parsedCourseId = parseInt(courseId, 10);

    if (isNaN(lessonId) || isNaN(parsedCourseId)) {
      showApiErrorInToast('Invalid lesson or course ID');
      setIsFlagging(false);
      return;
    }

    try {
      const response = await getDailyLessionDetail({
        lessonId: lesson,
        courseId,
        token,
        flag: true,
        userId: userDetail.id.toString(),
      });

      setLessonDetails(response.data.lessonDetail);
      setUserDetail(response.data.userDetail);
      setIsFlagged(response.data.flaggedLesson);

      // Update flagged details after successful flagging
      await fetchFlaggedDetails();

      showApiMessageInToast({ message: 'Lesson flagged successfully' });
      setIsFlagging(false);
    } catch (error) {
      showApiErrorInToast(error);
      setIsFlagging(false);
      setIsFlagged(false);
    }
  };

  const fetchFlaggedDetails = async () => {
    try {
      const details = await getFlaggedLessons();
      if (details?.data?.lessons) {
        const flaggedLesson = (details.data.lessons as FlaggedLesson[]).find(
          (flaggedLesson) => flaggedLesson.lesson_id === parseInt(lesson, 10),
        );

        if (flaggedLesson) {
          setFlaggedDetails({
            whoFlagged: `${flaggedLesson.user.first_name} ${flaggedLesson.user.last_name}`,
            whenFlagged: flaggedLesson.flagged_on,
          });
          setIsFlagged(true);
        } else {
          setFlaggedDetails(null);
          setIsFlagged(false);
        }
      }
    } catch (error) {
      console.error('Error fetching flagged details:', error);
      setFlaggedDetails(null);
    }
  };

  const markLessionAsUnread = async () => {
    try {
      const res = await markAsDonePublic(
        lesson,
        courseId,
        false,
        Number(userDetail?.id),
      );
      showApiMessageInToast(res);
      setIsRead(false);
      setIsChecked(false);
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  useEffect(() => {
    if (courseId && token && lesson) {
      getDailyLessionDetail({
        lessonId: lesson,
        courseId,
        token,
      })
        .then((response) => {
          setLessonDetails(response.data.lessonDetail);
          setUserDetail(response.data.userDetail);
          setIsFlagged(response.data.flaggedLesson);
          const userType = response.data.userDetail.user_type_id;
          setIsAdmins(
            userType === UserTypeIdEnum.ADMIN ||
              userType === UserTypeIdEnum.SUPERADMIN,
          );
          return response.data.userDetail;
        })
        .then((response) => {
          getLessonStatusPublic(lesson, Number(response.id))
            .then((res) => {
              setIsRead(res.data.isRead);
              setCompletedOn(res.data.completed_date);
              setIsChecked(res.data.isRead);
            })
            .catch((err) => console.log('err', err));
        })
        .catch((err) => {
          showApiErrorInToast(err);
          router.replace(RouteEnum.LOGIN);
        });

      // Fetch flagged details when component mounts
      fetchFlaggedDetails();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token, lesson, router]);

  const navigateUserToLearningPath = () => {
    router.replace(RouteEnum.LOGIN);
  };

  const renderLessonCompletionStatus = () => {
    if (isRead) {
      return (
        <div className="w-full flex align-middle justify-center">
          <p className="bg-green-100 p-5 rounded-md text-[#166534] flex justify-center items-center gap-2 my-5 mx-2 w-full lg:w-1/2 text-start">
            <span className="text-[#166534] flex bg-white rounded-full w-5 h-5 aspect-square font-bold items-center justify-center">
              <InformationCircleIcon fontWeight={''} />
            </span>
            <p>
              <span className="font-bold">
                {en.myLearningPath.alreadyCompleted}
              </span>{' '}
              {completedOn && en.myLearningPath.lessonCompleted(completedOn)}{' '}
              <span
                className="font-bold underline cursor-pointer"
                onClick={markLessionAsUnread}
              >
                {en.myLearningPath.markAsUnread}
              </span>
            </p>
          </p>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mb-20 mt-12">
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
    if (!isAdmins) return null;

    return (
      <div className="flex justify-center items-center mb-10 mt-6 ml-4">
        <button
          className="text-blue-600 text-[17px] font-semibold hover:text-white hover:bg-slate-400 hover:rounded-md py-2 px-3 disabled:text-gray-600"
          onClick={handleFlagLesson}
          disabled={isFlagged || isFlagging}
        >
          {isFlagged && flaggedDetails
            ? `Lesson is flagged by ${flaggedDetails.whoFlagged} on ${new Date(
                flaggedDetails.whenFlagged,
              ).toLocaleDateString()}`
            : 'Flag lesson for editing'}
        </button>
      </div>
    );
  };

  const renderNavigationButton = () => {
    if (!token) return null;

    return (
      <div className="fixed flex bottom-5 left-5">
        <Button color="blue" pill onClick={navigateUserToLearningPath}>
          <span className="flex items-center gap-1 justify-center">
            <HomeIcon height={'1rem'} width={'1rem'} />
            <span className="hidden md:flex">
              {en.lesson.NavigateToLearningPath}
            </span>
          </span>
        </Button>
      </div>
    );
  };

  if (!lessonDetails) return <FullPageLoader />;

  return (
    <div className="max-w-screen-2xl mx-auto mt-16 py-3 px-4 sm:py-5 lg:px-8">
      <ViewLesson lesson={lessonDetails} links={[]} showCreatedBy={false} />
      {renderLessonCompletionStatus()}
      {renderAdminControls()}
      {renderNavigationButton()}
    </div>
  );
};

export default DailyLessonDetail;
