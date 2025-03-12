import React, { FC, Fragment, useState } from 'react';
import { ActivityList, OutputData } from '../modals/ActivityGraph';
import { ReadFileIcon } from './UIElements';
import { format, subMonths } from 'date-fns';
import { en } from '@src/constants/lang/en';
import { DateFormats } from '@src/constants/dateFormats';
import Tooltip from './Tooltip';

interface Props {
  userActivityList: ActivityList[];
  userProgressArray: OutputData[];
}

const ActivityGraphWrapper: React.FC<Props> = ({
  userActivityList,
  userProgressArray,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const getColorClass = (status: string | undefined): string => {
    if (!status) return 'text-green-500';
    return status === 'COMPLETED' ? 'text-blue-500' : 'text-red-500';
  };

  function getLastSixMonths() {
    const months = [];
    for (let i = 0; i < 6; i += 1) {
      const date = subMonths(new Date(), i);
      months.unshift(format(date, 'MMM'));
    }
    return months;
  }
  return (
    <div className="w-full h-full">
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
        <div className="max-h-[260px] overflow-y-auto pt-6 lg:pt-4">
          {userActivityList && userActivityList.length ? (
            <ol className="relative ms-3 border-s border-dashed border-gray-200">
              {userActivityList.map((item: ActivityList, index: number) => (
                <Fragment key={index}>
                  <li className="mb-6 ms-6">
                    <span className="absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ring-white">
                      <ReadFileIcon colorClass={getColorClass(item.status)} />
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
                      {format(new Date(item.event_at), DateFormats.fullDate)}
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
                {userProgressArray?.map((item: OutputData, index: number) => {
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
                })}
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
  );
};

export default ActivityGraphWrapper;
