import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { CloseIcon, ReadFileIcon } from '../components/UIElements';
import { format, subMonths } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { TUser } from '../types/userTypes';
import { TUserDailyProgress } from '../types/contentRepository';
import Tooltip from '../components/Tooltip';

interface Props {
  userProgressData: Course[];
  userDailyProgressData: TUserDailyProgress[];
  isOpen: boolean;
  setShow: (value: boolean) => void;
  memberDetail: TUser;
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
interface OutputData {
  timestamp: string;
  count: number;
  opacity: number;
}

interface ActivityList {
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

  return (
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
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {['Activities', 'Consistency'].map((tab, index) => (
                <li className="mr-1" key={index + '-tab'}>
                  <button
                    className={`inline-block px-2 pb-2 ${
                      selectedTab === index
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                    }`}
                    type="button"
                    onClick={() => setSelectedTab(index)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedTab === 0 && (
            <div className="max-h-[230px] overflow-y-auto pt-6 lg:pt-4">
              {userActivityList && userActivityList.length ? (
                <ol className="relative ms-3 border-s border-dashed border-gray-200">
                  {userActivityList.map((item: ActivityList, index: number) => (
                    <Fragment key={index}>
                      <li className="mb-6 ms-6">
                        <span className="absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ring-white">
                          <ReadFileIcon
                            colorClass={getColorClass(item.status)}
                          />
                        </span>{' '}
                        <h3 className="mb-0.5 flex items-center pt-1 text-base font-semibold text-gray-900">
                          {item.lesson_name}
                        </h3>{' '}
                        <time className="mb-2 block text-gray-500 text-xs">
                          {item.status
                            ? item.status === 'COMPLETED'
                              ? en.teams.readDailyLessons
                              : en.teams.missedDailyLessons
                            : en.teams.markedCompletedOn}
                          {format(
                            new Date(item.event_at),
                            DateFormats.fullDate,
                          )}
                        </time>
                      </li>{' '}
                    </Fragment>
                  ))}
                </ol>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-xl">No Record Found.</p>
                </div>
              )}
            </div>
          )}
          {selectedTab === 1 && (
            <div className="flex item-center justify-center overflow-x-auto lg:pt-4">
              <div className="flex items-start gap-4 overflow-x-auto lg:overflow-x-visible pt-6 lg:pt-0">
                <div className="flex flex-col gap-2 pt-6">
                  <h6 className="h-4 text-xs">Sun</h6>
                  <h6 className="h-4 text-xs" />
                  <h6 className="h-4 text-xs">Tue</h6>
                  <h6 className="h-4 text-xs" />
                  <h6 className="h-4 text-xs">Thu</h6>
                  <h6 className="h-4 text-xs" />
                  <h6 className="h-4 text-xs">Sat</h6>
                </div>
                <div>
                  <div
                    className="flex items-center justify-between"
                    style={{ width: 600 }}
                  >
                    {getLastSixMonths().map((month: string, index: number) => (
                      <h6 className="w-full text-xs text-end" key={index}>
                        {month}
                      </h6>
                    ))}
                  </div>
                  <div
                    className="mt-2 grid w-full grid-flow-col gap-2"
                    style={{
                      gridTemplateRows: 'repeat(7, minmax(0px, 1fr))',
                    }}
                  >
                    {userProgressArray?.map(
                      (item: OutputData, index: number) => {
                        return (
                          <Tooltip
                            key={index + '-tooltip'}
                            content={`${item.count} activities on ${format(
                              item.timestamp,
                              DateFormats.shortDate,
                            )}`}
                          >
                            <div
                              className="h-4 w-4"
                              style={{
                                backgroundColor:
                                  item.count > 0
                                    ? `rgba( 101,163 ,13 , ${item.opacity})`
                                    : 'rgb(243, 243, 243)',
                              }}
                            />
                          </Tooltip>
                        );
                      },
                    )}
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-right text-xs">
                    <span>Less</span>
                    <span className="h-4 w-4 bg-lime-600 opacity-20" />
                    <span className="h-4 w-4 bg-lime-600 opacity-50" />
                    <span className="h-4 w-4 bg-lime-600 opacity-80" />
                    <span className="h-4 w-4 bg-lime-600" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ActivityGraph;
