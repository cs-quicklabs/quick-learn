'use client';
import React, { useEffect, useState } from 'react';
import { en } from '@src/constants/lang/en';
import { getLeaderBoardStatus } from '@src/apiServices/lessonsService';

const getMedalEmoji = (index: number) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return '';
};

const LeaderboardTable = () => {
  const [leaderBoardRanking, setLeaderBoardRanking] = useState<any[]>([]);

  useEffect(() => {
    getLeaderBoardStatus()
      .then((res) => {
        setLeaderBoardRanking(res.data.leaderBoardWithPercentage);
      })
      .catch((err) => console.error('Error fetching leaderboard:', err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y border-t border-gray-200 divide-gray-200 text-sm text-left text-gray-500 overflow-x-auto">
        <thead className="text-sm text-gray-700 uppercase bg-gray-50 text-left">
          <tr>
            <th scope="col" className="px-4 py-3">
              {en.teams.User}
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Ranking
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Total Lesson read
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardRanking &&
            leaderBoardRanking.length > 0 &&
            leaderBoardRanking.map((user, index) => (
              <tr
                key={user.email}
                className="bg-white border-b border-gray-200 hover:bg-gray-50 "
              >
                <td className="px-4 py-2 font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-4 py-2 text-center">
                  # {index + 1}
                  <span>{getMedalEmoji(index)}</span>
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 text-center">
                  {user.lessonCompleted}
                  <span className="text-gray-500 text-xs">
                    ({user.lesson_count})
                  </span>
                </td>
              </tr>
            ))}
          {(!leaderBoardRanking || leaderBoardRanking.length === 0) && (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
