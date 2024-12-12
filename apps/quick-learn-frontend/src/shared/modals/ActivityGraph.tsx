import React, { Fragment, useEffect, useState } from 'react';
import { CourseProgress } from '@src/store/features/userProgressSlice';
import { Modal, Tabs } from 'flowbite-react';

interface props {
  userProgressData: CourseProgress[];
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

const ActivityGraph: React.FC<props> = (userProgressData) => {
  const [userProgressArray, setUserProgressArray] = useState<OutputData[]>([]);

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
    input.forEach((item) => {
      inputMap.set(item.date, item.count);
    });

    for (let d = new Date(sixMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const currentDate = d.toISOString().split('T')[0];
      const count = inputMap.get(currentDate) || 0;

      // Calculate opacity based on count (e.g., linear scaling)
      const opacity = count > 0 ? Math.min(count / 10, 1) : 0; // Example scaling logic

      result.push({
        timestamp: currentDate,
        count,
        opacity,
      });
    }

    return result;
  };

  useEffect(() => {
    if (userProgressData) {
      setUserProgressArray(generateDailyData(getDateCounts(userProgressData)));
    }
  }, [userProgressData]);

  return (
    <Fragment>
      <Modal show={false} size='4xl'>
        <Modal.Header className="border-none">Activitys</Modal.Header>
        <Modal.Body className="mt-[-40px]">
          <Tabs
            aria-label="m-0"
            variant="default"
            className="text-slate-500 active::text-blue-600"
          >
            <Tabs.Item active title="Activities" className=""></Tabs.Item>
            <Tabs.Item title="Events"></Tabs.Item>
            <Tabs.Item title="Consistency">
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
                      style={{ width: 640 }}
                    >
                      <h6 className="w-full text-xs">Jul</h6>
                      <h6 className="w-full text-xs">Aug</h6>
                      <h6 className="w-full text-xs">Sep</h6>
                      <h6 className="w-full text-xs">Oct</h6>
                      <h6 className="w-full text-xs">Nov</h6>
                      <h6 className="w-full text-xs">Dec</h6>
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
                            <div
                              key={index}
                              className={`h-4 w-4 rounded bg-sky-900 opacity-${
                                item.opacity > 0 ? item.opacity * 2 * 10 : 20
                              }`}
                            />
                          );
                        },
                      )}
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs">
                      <span>Less</span>
                      <span className="h-4 w-4 rounded bg-sky-600 opacity-10" />
                      <span className="h-4 w-4 rounded bg-sky-900 opacity-20" />
                      <span className="h-4 w-4 rounded bg-sky-900 opacity-40" />
                      <span className="h-4 w-4 rounded bg-sky-900 opacity-80" />
                      <span className="h-4 w-4 rounded bg-sky-900" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Item>
          </Tabs>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default ActivityGraph;
