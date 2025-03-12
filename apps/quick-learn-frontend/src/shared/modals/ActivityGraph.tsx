import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { CloseIcon, ReadFileIcon } from '../components/UIElements';
import { format, subMonths } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { TUser } from '../types/userTypes';
import { TUserDailyProgress } from '../types/contentRepository';
import Tooltip from '../components/Tooltip';
import ActivityGraphWrapper from '../components/ActivityGraphWrapper';

interface Props {
  userProgressData: Course[];
  userDailyProgressData: TUserDailyProgress[];
  isOpen?: boolean;
  setShow: (value: boolean) => void;
  memberDetail: TUser;
  isDialog?: boolean;
}

interface Lesson {
  lesson_id: number;
  completed_date: string;
  lesson_name: string;
  created_at?: string;
  updated_at?: string;
  event_at?: string;
}

export interface Course {
  course_id: number;
  lessons: Lesson[];
}
interface DateCount {
  date: string;
  count: number;
}

interface InputData {
  date: string;
  count: number;
}

interface DailyLessonProgress {
  id: number;
  created_at: string;
  updated_at: string;
  token: string;
  user_id: number;
  lesson_id: number;
  course_id: number;
  status: string;
  expiresAt: string;
  lesson: {
    name: string;
  };
}
export interface OutputData {
  timestamp: string;
  count: number;
  opacity: number;
}

export interface ActivityList {
  lesson_id: number;
  event_at: string;
  lesson_name?: string;
  course_id?: number;
  status?: string;
  user_id?: number;
  token?: string;
}

const getColorClass = (status: string | undefined): string => {
  if (!status) return 'text-green-500';
  return status === 'COMPLETED' ? 'text-blue-500' : 'text-red-500';
};

const ActivityGraph: React.FC<Props> = ({
  userProgressData,
  userDailyProgressData,
  isOpen,
  setShow,
  memberDetail,
  isDialog = true,
}: Props) => {
  const [userProgressArray, setUserProgressArray] = useState<OutputData[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [userActivityList, setUserActivityList] = useState<ActivityList[]>([]);

  const getDateCounts = (courses: Course[]): DateCount[] => {
    const dateCounts: Record<string, number> = {};
    courses.forEach((course) => {
      course.lessons.forEach((lesson) => {
        // Extract the date (ignoring time)
        const date = lesson.completed_date.split('T')[0];
        // Increment the count for this date
        if (dateCounts[date]) {
          dateCounts[date] += 1;
        } else {
          dateCounts[date] = 1;
        }
      });
    });
    // Convert the dateCounts object to an array of objects
    return Object.entries(dateCounts).map(([date, count]) => ({ date, count }));
  };

  const generateDailyData = (input: InputData[]): OutputData[] => {
    const result: OutputData[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    // Check if sixMonthsAgo is not a Sunday (0 is Sunday in JavaScript)
    if (sixMonthsAgo.getDay() !== 0) {
      // Calculate the difference to the next Sunday
      const daysUntilSunday = 7 - sixMonthsAgo.getDay();
      sixMonthsAgo.setDate(sixMonthsAgo.getDate() + daysUntilSunday);
    }

    const inputMap = new Map<string, number>();
    let maxCount = 0;

    // Populate the map and find the maximum count
    input.forEach((item) => {
      inputMap.set(item.date, item.count);
      if (item.count > maxCount) {
        maxCount = item.count;
      }
    });

    for (let d = new Date(sixMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const currentDate = d.toISOString().split('T')[0];
      const count = inputMap.get(currentDate) ?? 0;

      // Calculate opacity based on the highest count and normalize
      const normalizedOpacity = maxCount > 0 ? count / maxCount : 0;

      result.push({
        timestamp: currentDate,
        count,
        opacity: normalizedOpacity,
      });
    }

    return result;
  };

  function getLastSixMonths() {
    const months = [];
    for (let i = 0; i < 6; i += 1) {
      const date = subMonths(new Date(), i);
      months.unshift(format(date, 'MMM'));
    }
    return months;
  }

  const mergeArrays = (
    array1: Lesson[],
    array2: DailyLessonProgress[],
  ): ActivityList[] => {
    // Process first array
    const processedArray1 = array1.map((item) => ({
      lesson_id: item.lesson_id,
      lesson_name: item.lesson_name,
      event_at: item.completed_date,
    }));

    // Process second array
    const processedArray2 = array2.map((item) => ({
      lesson_id: item.lesson_id,
      course_id: item.course_id,
      status: item.status,
      user_id: item.user_id,
      lesson_name: item.lesson.name,
      token: item.token,
      event_at:
        item.created_at === item.updated_at ? item.expiresAt : item.updated_at,
    }));

    // Combine both arrays
    return [...processedArray1, ...processedArray2];
  };
  useEffect(() => {
    if (userProgressData?.length) {
      setUserProgressArray(generateDailyData(getDateCounts(userProgressData)));

      // Extract all lessons
      const allLessons = userProgressData.flatMap((course) => course.lessons);

      const mergedArray = mergeArrays(allLessons, userDailyProgressData);

      // SORT the lessons by completed_date in descending order
      mergedArray.sort(
        (a, b) =>
          new Date(b.event_at).valueOf() - new Date(a.event_at).valueOf(),
      );

      setUserActivityList(mergedArray);
    } else {
      setUserProgressArray(generateDailyData(getDateCounts([])));
    }
  }, [userDailyProgressData, userProgressData]);

  return isDialog ? (
    <Dialog
      open={isOpen}
      onClose={() => setShow(false)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-x">
          <div className="mb-4 flex items-center justify-between rounded-t sm:mb-5">
            <p className="text-lg font-semibold text-gray-900">
              {memberDetail?.first_name} {memberDetail?.last_name.concat("'s")}{' '}
              Activities
            </p>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2.5 ml-auto inline-flex items-center"
              onClick={() => setShow(false)}
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>
          <ActivityGraphWrapper
            userActivityList={userActivityList}
            userProgressArray={userProgressArray}
          />
        </DialogPanel>
      </div>
    </Dialog>
  ) : (
    <ActivityGraphWrapper
      userActivityList={userActivityList}
      userProgressArray={userProgressArray}
    />
  );
};

export default ActivityGraph;
