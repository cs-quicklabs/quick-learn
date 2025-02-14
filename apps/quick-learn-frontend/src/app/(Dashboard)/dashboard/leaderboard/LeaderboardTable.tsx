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

const getMedalEmoji = (rank: number, lessonsCount: number) => {
  if (rank === 1 && lessonsCount > 0)
    return <span className="text-yellow-500">🥇</span>;
  if (rank === 2 && lessonsCount > 0)
    return <span className="text-gray-500">🥈</span>;
  if (rank === 3 && lessonsCount > 0)
    return <span className="text-red-500">🥉</span>;
  if (lessonsCount <= 3) {
    return (
      <span
        className="text-gray-500 cursor-help relative group"
        data-tooltip="Complete more than 3 lessons to remove this badge"
      >
        <span>👎</span>
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-sm text-gray-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100 border border-gray-200">
          Complete more than 3 lessons to remove this badge
        </span>
      </span>
    );
  }
  return '';
};

const SkeletonLoader = () => {
  return (
    <tbody className="animate-pulse">
      {[...Array(20)].map((_, index) => (
        <tr key={+index} className="border-b border-gray-200">
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded w-64" />
          </td>
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded w-16" />
          </td>
          <td className="px-4 py-2">
            <div className="h-5 bg-gray-200 rounded w-20" />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

const LeaderboardTable = () => {
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardData[]>(
    [],
  );
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<
    LeaderboardData[]
  >([]);
  const params = useSearchParams();
  const [type, setType] = useState(params.get('type') ?? 'weekly');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAppSelector(selectUser);
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
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

      if (type === 'weekly') {
        setWeeklyLeaderboard((prev) =>
          currentPage === 1 ? newData : [...prev, ...newData],
        );
      } else {
        setMonthlyLeaderboard((prev) =>
          currentPage === 1 ? newData : [...prev, ...newData],
        );
      }
      setHasMore(newData.length > 0);
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
    setHasMore(true);
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
    return currentLeaderboard.map((user) => {
      const isCurrentUser = currentUser?.id === user?.user?.id;
      return (
        <tr
          key={user.user_id}
          ref={
            currentLeaderboard.length - 1 === user.user_id
              ? lastElementRef
              : null
          }
          className={`bg-white border-b border-gray-200 hover:bg-gray-50 ${
            isCurrentUser ? 'bg-yellow-200 hover:bg-yellow-100' : ''
          }`}
        >
          <td className="px-4 py-2 font-medium text-slate-900 capitalize">
            {user.user.first_name} {user.user.last_name}
          </td>
          <td className="pl-6 py-2">
            {user.rank} {getMedalEmoji(user.rank, user.lessons_completed_count)}
          </td>
          <td className="pl-10 md:pl-16 py-2">
            {user.lessons_completed_count}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="relative overflow-x-auto border-t border-gray-200 shadow-md  overflow-y-auto sm:rounded-lg">
      <div className=" text-xs font-bold flex space-x-1 rounded-lg  p-0.5 justify-between items-center">
        <div className="text-sm  ml-3 text-gray-700">
          Records from {getRecords(type)}
        </div>
        <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
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
            <th className="px-4 py-3 w-1/2">
              {en.leaderboard.leaderboardUser}
            </th>
            <th className="px-4 py-3 w-1/4">
              {en.leaderboard.leaderboardRank}
            </th>
            <th className="px-4 py-3 w-1/4">
              {en.leaderboard.leaderboardLessonsCompleted}
            </th>
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
                No data found
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default LeaderboardTable;
