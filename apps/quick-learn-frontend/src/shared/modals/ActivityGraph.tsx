import React, { Fragment, useEffect, useState } from 'react';
import { CourseProgress } from '@src/store/features/userProgressSlice';
import { Modal } from 'flowbite-react';
import { CloseIcon } from '../components/UIElements';
import { format, subMonths } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { DateFormats } from '@src/constants/dateFormats';

interface props {
  userProgressData: CourseProgress[];
  isOpen: boolean;
}

interface Lesson {
  lesson_id: number;
  completed_date: string;
}

interface Course {
  course_id: number;
  lessons: Lesson[];
}

interface UserProgressData {
  userProgressData: Course[];
}

interface DateCount {
  date: string;
  count: number;
}

interface InputData {
  date: string;
  count: number;
}

interface OutputData {
  timestamp: string;
  count: number;
  opacity: number;
}

const ActivityGraph: React.FC<props> = (userProgressData, isOpen) => {
  const [userProgressArray, setUserProgressArray] = useState<OutputData[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const getDateCounts = (data: UserProgressData): DateCount[] => {
    const dateCounts: Record<string, number> = {};

    // Loop through each course
    data.userProgressData.forEach((course) => {
      // Loop through each lesson in the course
      course.lessons.forEach((lesson) => {
        // Extract the date (ignoring time)
        const date = lesson.completed_date.split('T')[0];

        // Increment the count for this date
        if (dateCounts[date]) {
          dateCounts[date]++;
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
      const count = inputMap.get(currentDate) || 0;

      // Calculate opacity based on the highest count and normalize
      const normalizedOpacity = maxCount > 0 ? (count / maxCount) * 100 : 0;
      const tailwindOpacity = Math.round(normalizedOpacity / 5) * 5;

      result.push({
        timestamp: currentDate,
        count,
        opacity: tailwindOpacity,
      });
    }

    return result;
  };

  function getLastSixMonths() {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      months.unshift(format(date, 'MMM'));
    }
    return months;
  }

  useEffect(() => {
    if (userProgressData) {
      setUserProgressArray(generateDailyData(getDateCounts(userProgressData)));
    }
  }, [userProgressData]);

  return (
    <Fragment>
      <Modal show={isOpen} size="4xl">
        <Modal.Body>
          <div className="mb-4 flex items-center justify-between rounded-t dark:border-gray-700 sm:mb-5">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              User Activity
            </p>
            <div>
              <CloseIcon />
            </div>
          </div>
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
            >
              <li className="mr-1">
                <button
                  className={`inline-block px-2 pb-2 ${
                    selectedTab === 0
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:border-transparent'
                  }`}
                  id="brand-tab"
                  data-tabs-target="#brandi"
                  type="button"
                  role="tab"
                  aria-controls="brandi"
                  aria-selected="true"
                  onClick={() => setSelectedTab(0)}
                >
                  Activities
                </button>
              </li>
              <li className="mr-1">
                <button
                  className={`inline-block px-2 pb-2 ${
                    selectedTab === 1
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:border-transparent'
                  }`}
                  id="advanced-filers-tab"
                  data-tabs-target="#advanced-filters"
                  type="button"
                  role="tab"
                  aria-controls="advanced-filters"
                  aria-selected="false"
                  onClick={() => setSelectedTab(1)}
                >
                  Events
                </button>
              </li>
              <li className="mr-1">
                <button
                  className={`inline-block px-2 pb-2 ${
                    selectedTab === 2
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:border-transparent'
                  }`}
                  id="consistency-tab"
                  data-tabs-target="#consistency"
                  type="button"
                  role="tab"
                  aria-controls="consistency"
                  aria-selected="false"
                  onClick={() => setSelectedTab(2)}
                >
                  Consistency
                </button>
              </li>
            </ul>
          </div>

          <div id="myTabContent">
            {selectedTab === 0 && <Fragment></Fragment>}
            {selectedTab === 1 && <Fragment></Fragment>}
            {selectedTab === 2 && (
              <div className="grid place-items-center">
                <div className="flex items-start gap-4">
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
                      {getLastSixMonths().map(
                        (month: string, index: number) => (
                          <h6 className="w-full text-xs" key={index}>
                            {month}
                          </h6>
                        ),
                      )}
                    </div>
                    <div
                      className="mt-2 grid w-full grid-flow-col gap-2"
                      style={{
                        gridTemplateRows: 'repeat(7, minmax(0px, 1fr))',
                      }}
                    >
                      {/* MAIN GRID */}
                      {userProgressArray?.map(
                        (item: OutputData, index: number) => {
                          return (
                            <Fragment key={index}>
                              <Tooltip
                                content={`${item.count} activities on ${format(
                                  item.timestamp,
                                  DateFormats.shortDate,
                                )}`}
                                placement="top"
                              >
                                <div
                                  className={`h-4 w-4 bg-lime-600 opacity-${item.opacity > 0 ? item.opacity : 10}`}
                                />
                              </Tooltip>
                            </Fragment>
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
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default ActivityGraph;
