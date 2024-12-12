import React, { Fragment, useEffect, useState } from 'react';
import { CourseProgress } from '@src/store/features/userProgressSlice';

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
      <div className="grid grid-cols-1 rounded-[10px] border border-slate-300 bg-custom-background-100 lg:grid-cols-3">
        <div className="grid grid-cols-1 divide-y divide-custom-border-200 border-b border-slate-300 lg:border-b-0 lg:border-r">
          <div className="flex">
            <div className="basis-1/2 p-4">
              <h4 className="text-sm">Assigned Roadmaps</h4>
              <h5 className="mt-2 text-2xl font-semibold">
                <div className="cursor-pointer">8</div>
              </h5>
            </div>
            <div className="basis-1/2 border-l border-slate-300 p-4">
              <h4 className="text-sm">Assigned Courses</h4>
              <h5 className="mt-2 text-2xl font-semibold">7</h5>
            </div>
          </div>
          <div className="flex border-slate-300">
            <div className="basis-1/2 p-4">
              <h4 className="text-sm">Assigned Lessions</h4>
              <h5 className="mt-2 text-2xl font-semibold">1</h5>
            </div>
            <div className="basis-1/2 border-l border-slate-300 p-4">
              <h4 className="text-sm">Completed Lessions</h4>
              <h5 className="mt-2 text-2xl font-semibold">0</h5>
            </div>
          </div>
        </div>
        <div className="p-4 lg:col-span-2">
          <h3 className="mb-2 flex items-center gap-2 font-semibold capitalize">
            Activity Graph
          </h3>
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
                  style={{ gridTemplateRows: 'repeat(7, minmax(0px, 1fr))' }}
                >
                  {/* MAIN GRID */}
                  {userProgressArray?.map((item: OutputData, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`h-4 w-4 rounded bg-sky-900 opacity-${item.opacity > 0 ? (item.opacity*2) * 10 : 20}`}
                      />
                    );
                  })}
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
        </div>
      </div>
    </Fragment>
  );
};

export default ActivityGraph;
