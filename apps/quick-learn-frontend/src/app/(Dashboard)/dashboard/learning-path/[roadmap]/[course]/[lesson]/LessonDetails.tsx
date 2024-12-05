'use client';
import { getLearningPathLessionDetails } from '@src/apiServices/learningPathService';
import { getLessonStatus, markAsDone } from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdInfo } from 'react-icons/md';

const defaultlinks: TBreadcrumb[] = [
  { name: en.myLearningPath.heading, link: RouteEnum.MY_LEARNING_PATH },
];
const LessonDetails = () => {
  const { roadmap, course, lesson } = useParams<{
    roadmap: string;
    course: string;
    lesson: string;
  }>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [lessonDetails, setLessonDetails] = useState<TLesson>();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(false); // remove it when userprogress is being declared globally
  const [completedOn, setCompletedOn] = useState<string>('');

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    try {
      const res = await markAsDone(lesson, course, true);
      showApiMessageInToast(res);
      setIsRead(res.data.isRead);
      setCompletedOn(res.data.completed_date);
      setIsChecked(res.data.isRead);
      console.log(`Lesson ${checked ? 'completed' : 'not completed'}`);
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  const markLessionAsUnread = async () => {
    try {
      const res = await markAsDone(lesson, course, false);
      showApiMessageInToast(res);
      setIsRead(false);
      setIsChecked(false);
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  useEffect(() => {
    getLearningPathLessionDetails(
      lesson,
      course,
      roadmap && !isNaN(+roadmap) ? roadmap : undefined,
    )
      .then((res) => {
        setLessonDetails(res.data);
        const tempLinks = [...defaultlinks];
        if (roadmap && !isNaN(+roadmap)) {
          tempLinks.push({
            name: res.data.course.roadmaps?.[0]?.name ?? '',
            link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}`,
          });
        }
        tempLinks.push({
          name: res.data.course.name ?? '',
          link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course}`,
        });
        tempLinks.push({
          name: res.data?.name ?? '',
          link: `${RouteEnum.MY_LEARNING_PATH}/${roadmap}/${course}/${lesson}`,
        });
        setLinks(tempLinks);
      })
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(RouteEnum.MY_LEARNING_PATH);
      });

    getLessonStatus(lesson)
      .then((res) => {
        setIsRead(res.data.isRead);
        setCompletedOn(res.data.completed_date);
        setIsChecked(res.data.isRead);
      })
      .catch((err) => console.log('err', err));
  }, [router, lesson, course, roadmap]);

  if (!lessonDetails) return <FullPageLoader />;
  return (
    <>
      <ViewLesson lesson={lessonDetails} links={links} />
      {/* <input type="text" onClick={handlereadme} /> */}
      {isRead ? (
        <div className="w-full flex align-middle justify-center">
          <p className="bg-green-100 p-5 rounded-md text-[#166534] text-center flex justify-center items-center gap-2 mb-7 w-1/2 text-start">
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
    </>
  );
};

export default LessonDetails;
