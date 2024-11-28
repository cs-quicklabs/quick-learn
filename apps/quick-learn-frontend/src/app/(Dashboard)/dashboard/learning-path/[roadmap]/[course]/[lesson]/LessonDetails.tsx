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
import { MdOutlineDone } from 'react-icons/md';

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

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    try {
      const res = await markAsDone(lesson, course);
      showApiMessageInToast(res);
      setIsRead(true);
      console.log(`Lesson ${checked ? 'completed' : 'not completed'}`);
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
      })
      .catch((err) => console.log('err', err));
  }, [router, lesson, course, roadmap]);

  if (!lessonDetails) return <FullPageLoader />;
  return (
    <>
      <ViewLesson lesson={lessonDetails} links={links} />
      {/* <input type="text" onClick={handlereadme} /> */}
      {isRead ? (
        <p className="text-slate-500 italic text-center flex justify-center items-center gap-2">
          <span className="bg-green-600 flex text-white rounded-full w-4 h-4 aspect-square font-bold items-center justify-center  ">
            <MdOutlineDone />
          </span>
          You have completed the lesson
        </p>
      ) : (
        <div className="flex justify-center items-center gap-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Mark the lesson read
        </div>
      )}
    </>
  );
};

export default LessonDetails;
