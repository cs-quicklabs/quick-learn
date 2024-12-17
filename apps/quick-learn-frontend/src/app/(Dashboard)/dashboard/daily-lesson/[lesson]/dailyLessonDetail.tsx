'use client';
import {
  getDailyLessionDetail,
  getLessonStatus,
  markAsDone,
} from '@src/apiServices/lessonsService';
import { TLesson } from '@src/shared/types/contentRepository';
import { fetchUserProgress } from '@src/store/features/userProgressSlice';
import { useAppDispatch } from '@src/store/hooks';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { UserContext } from '@src/context/userContext';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { en } from '@src/constants/lang/en';
import { MdInfo } from 'react-icons/md';
import ViewLesson from '@src/shared/components/ViewLesson';
import { Button } from 'flowbite-react';

const DailyLessonDetail = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [courseId, setCourseId] = useState('');
  const [token, setToken] = useState('');
  const { user } = useContext(UserContext);
  const [lessonDetails, setLessonDetails] = useState<TLesson>();
  const [isChecked, setIsChecked] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [completedOn, setCompletedOn] = useState<string>('');

  const { lesson } = useParams<{
    lesson: string;
  }>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const course_id = params.get('course_id');
      setCourseId(course_id || '');
      const token = params.get('token');
      setToken(token || '');
    }
  }, []);

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    try {
      const res = await markAsDone(lesson, courseId, true, Number(user?.id));
      showApiMessageInToast(res);
      setIsRead(res.data.isRead);
      setCompletedOn(res.data.completed_date);
      setIsChecked(res.data.isRead);
      await dispatch(fetchUserProgress());
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  const markLessionAsUnread = async () => {
    try {
      const res = await markAsDone(lesson, courseId, false, Number(user?.id));
      await dispatch(fetchUserProgress());
      showApiMessageInToast(res);
      setIsRead(false);
      setIsChecked(false);
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };
  useEffect(() => {
    if (courseId && token && lesson) {
      getDailyLessionDetail(lesson, courseId, token)
        .then((response) => {
          setLessonDetails(response.data);
        })
        .catch((err) => {
          showApiErrorInToast(err);
          router.replace(RouteEnum.MY_LEARNING_PATH);
        });

      getLessonStatus(lesson)
        .then((res) => {
          setIsRead(res.data.isRead);
          setCompletedOn(res.data.completed_date);
          setIsChecked(res.data.isRead);
        })
        .catch((err) => console.log('err', err));
    }
  }, [courseId, token, lesson, router, user]);

  const navigateUserToLearningPath = () => {
    router.replace(RouteEnum.MY_LEARNING_PATH);
  };

  if (!lessonDetails) return <FullPageLoader />;

  return (
    <Fragment>
      <ViewLesson lesson={lessonDetails} links={[]} showCreatedBy={false} />
      {isRead ? (
        <div className="w-full flex align-middle justify-center">
          <p className="bg-green-100 p-5 rounded-md text-[#166534]  flex justify-center items-center gap-2 mb-7 w-1/2 text-start">
            <span className="bg-[#166534] flex text-white rounded-full w-4 h-4 aspect-square font-bold items-center justify-center  ">
              <MdInfo />
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
      ) : (
        <div className="flex justify-center items-center gap-4 mb-48 mt-12">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="rounded-md h-8 w-8 border-gray-400 bg-[#F4F4F6]"
          />
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-300">
            {en.myLearningPath.markRead}
          </p>
        </div>
      )}
      {token && (
        <div className="w-full align-start flex">
          <Button color="blue" pill onClick={navigateUserToLearningPath}>
            {en.lesson.NavigateToLearningPath}
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default DailyLessonDetail;
