'use client';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { en } from '@src/constants/lang/en';
import { getLeaderBoardStatus } from '@src/apiServices/lessonsService';
import { useAppSelector } from '@src/store/hooks';
import { selectUser } from '@src/store/features/userSlice';
import { getRecords } from '@src/utils/helpers';
import { LeaderboardData } from '@src/shared/types/LessonProgressTypes';
import { useSearchParams } from 'next/navigation';
import SkeletonLoader from './SkeletonLoader';

const getMedalEmoji = (rank: number, totalUser: number) => {
  if (rank === 1) return <span className="text-yellow-500">🥇</span>;
  if (rank === 2) return <span className="text-gray-500">🥈</span>;
  if (rank === 3) return <span className="text-red-500">🥉</span>;
  if (totalUser - rank < 5) {
    //this will display the :thumbs down to approx. bottom 10% of user.
    return (
      <span
        className="text-gray-500 cursor-help relative group"
        data-tooltip="Complete more than 3 lessons to remove this badge"
      >
        <span>👎</span>
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-sm text-gray-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100 border border-gray-200">
          {en.leaderboard.tooltipsText}
        </span>
      </span>
    );
  }
  return '';
};

const tableHeader = [
  en.leaderboard.leaderboardUser,
  en.leaderboard.leaderboardRank,
  en.leaderboard.leaderboardLessonsCompleted,
  en.leaderboard.learningScore,
];

const LeaderboardTable = () => {
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardData[]>(
    [],
  );
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<
    LeaderboardData[]
  >([]);
  const params = useSearchParams();
  const initalType = params.get('type');
  const [type, setType] = useState(initalType ?? 'weekly');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAppSelector(selectUser);
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page * 25 < total) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, page, total],
  );

  // Memoize the current leaderboard based on type
  const currentLeaderboard = useMemo(() => {
    return type === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard;
  }, [type, weeklyLeaderboard, monthlyLeaderboard]);

  const fetchLeaderboardData = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await getLeaderBoardStatus(currentPage, 25, type);
      const newData = response.data.items;
      setTotal(response.data.total);

      if (type === 'weekly') {
        setWeeklyLeaderboard((prev) =>
          currentPage === 1 ? newData : [...prev, ...newData],
        );
      } else {
        setMonthlyLeaderboard((prev) =>
          currentPage === 1 ? newData : [...prev, ...newData],
        );
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    if (newType === type) return;
    setType(newType);
    setPage(1);
    // Only fetch if we don't have data for this type
    if (
      (newType === 'weekly' && weeklyLeaderboard.length === 0) ||
      (newType === 'monthly' && monthlyLeaderboard.length === 0)
    ) {
      fetchLeaderboardData(1);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type]);

  const renderLeaderboard = () => {
    const totalDivident = Math.round(total / 10);

    return currentLeaderboard.map((user, index) => {
      const isCurrentUser = currentUser?.id === user?.user?.id; // yellow line
      const isLastElement = index === currentLeaderboard.length - 1;
      const learningScore = 10 - Math.floor((user.rank - 1) / totalDivident);
      return (
        <tr
          key={user.user_id}
          ref={isLastElement ? lastElementRef : null}
          className={`bg-white border-b border-gray-200 hover:bg-gray-50 ${
            isCurrentUser ? 'bg-yellow-200 hover:bg-yellow-100' : ''
          }`}
        >
          <td className="px-4 py-2 font-medium text-slate-900 capitalize">
            {user.user.first_name} {user.user.last_name}
          </td>
          <td className="pl-6 py-2">
            {user.rank} {getMedalEmoji(user.rank, total)}
          </td>
          <td className="pl-10 md:pl-16 py-2 whitespace-nowrap">
            {user.lessons_completed_count}
          </td>
          <td className="pl-10 md:pl-16 py-2 whitespace-nowrap">
            {learningScore <= 0 || user.lessons_completed_count === 0
              ? '-1'
              : learningScore}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="relative overflow-x-auto border-t border-gray-200 shadow-md  overflow-y-auto sm:rounded-lg">
      <div className=" text-xs font-bold md:flex space-x-1 rounded-lg  p-0.5 md:justify-between md:items-center ">
        <div className="text-sm mb-2 ml-3 md:mb-0 text-gray-700">
          Records from {getRecords(type)}
        </div>
        <div className="flex space-x-1 bg-slate-200 p-1 w-52 md:w-auto rounded-lg">
          <button
            type="button"
            className={`group flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-200 ${
              type === 'weekly'
                ? 'bg-blue-400 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
            onClick={() => handleTypeChange('weekly')}
          >
            {en.leaderboard.weekly}
          </button>
          <button
            type="button"
            className={`group flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-200 ${
              type === 'monthly'
                ? 'bg-blue-400 text-white'
                : 'bg-gray-200 text-gray-500 '
            }`}
            onClick={() => handleTypeChange('monthly')}
          >
            {en.leaderboard.monthly}
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 border-t border-gray-200 uppercase bg-gray-50">
          <tr>
            {tableHeader.map((item) => (
              <th
                key={item}
                className={`px-4 py-3 whitespace-nowrap ${
                  item === en.leaderboard.leaderboardUser
                    ? 'w-[40%]'
                    : 'w-[20%]'
                }`}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        {isLoading && currentLeaderboard.length === 0 ? (
          <SkeletonLoader />
        ) : (
          <tbody>{renderLeaderboard()}</tbody>
        )}
        {currentLeaderboard.length === 0 && !isLoading && (
          <tbody>
            <tr>
              <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                {en.leaderboard.noDataFound}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default LeaderboardTable;
