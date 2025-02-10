'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { en } from '@src/constants/lang/en';
import { getLeaderBoardStatus } from '@src/apiServices/lessonsService';
import { useAppSelector } from '@src/store/hooks';
import { selectUser } from '@src/store/features/userSlice';
import { TUser } from '@src/shared/types/userTypes';
interface LeaderboardData {
  user_id: number;
  lessonsCompleted: number;
  rank: number;
  user: TUser;
}
const getMedalEmoji = (index: number) => {
  if (index === 1) return <span className="text-yellow-500">🥇</span>;
  if (index === 2) return <span className="text-gray-500">🥈</span>;
  if (index === 3) return <span className="text-red-500">🥉</span>;
  return '';
};

const LeaderboardTable = () => {
  const [leaderBoardRanking, setLeaderBoardRanking] = useState<
    LeaderboardData[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchLeaderboardData = async (currentPage: number) => {
    try {
      setIsLoading(true);
      const response = await getLeaderBoardStatus(currentPage, 10);
      const newData = response.data.items;

      setLeaderBoardRanking((prev) =>
        currentPage === 1 ? newData : [...prev, ...newData],
      );
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(page);
  }, [page]);

  return (
    <div className="relative overflow-x-auto border-t border-gray-200 shadow-md max-h-[595px] overflow-y-auto sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 border-b border-gray-200 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3">{en.leaderboard.leaderboardUser}</th>
            <th className="px-4 py-3">{en.leaderboard.leaderboardRank}</th>
            <th className="px-4 py-3">
              {en.leaderboard.leaderboardLessonsCompleted}
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardRanking &&
            leaderBoardRanking.length > 0 &&
            leaderBoardRanking.map((user, index) => (
              <tr
                key={`${user.user_id}-${index}`}
                ref={
                  index === leaderBoardRanking.length - 1
                    ? lastElementRef
                    : null
                }
                className={`bg-white border-b border-gray-200 hover:bg-gray-50 ${
                  currentUser?.id === user?.user?.id
                    ? 'bg-yellow-200 hover:bg-yellow-100'
                    : ''
                }`}
              >
                <td className="px-4 py-2">
                  {user.user.first_name} {user.user.last_name}
                </td>
                <td className="pl-6 py-2">
                  {user.rank} {getMedalEmoji(user.rank)}
                </td>
                <td className="pl-10 md:pl-16 py-2">{user.lessonsCompleted}</td>
              </tr>
            ))}
          {isLoading && (
            <tr>
              <td colSpan={3} className="px-4 py-3 text-center">
                {en.leaderboard.leaderboardLoading}
              </td>
            </tr>
          )}
          {!hasMore && (
            <tr>
              <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                {en.leaderboard.leaderboardNoMoreData}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
