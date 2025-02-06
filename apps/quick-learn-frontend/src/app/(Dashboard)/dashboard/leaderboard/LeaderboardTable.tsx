'use client';
import React, { useEffect, useState } from 'react';
import { en } from '@src/constants/lang/en';
import { getLeaderBoardStatus } from '@src/apiServices/lessonsService';

const LeaderboardTable = () => {
  const [leaderBoardRanking, setLeaderBoardRanking] = useState<any[]>([]);

  useEffect(() => {
    getLeaderBoardStatus()
      .then((res) => setLeaderBoardRanking(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
          <tr>
            <th scope="col" className="px-4 py-3">
              {en.teams.User}
            </th>
            <th scope="col" className="px-4 py-3">
              {en.teams.Email}
            </th>

            <th scope="col" className="px-4 py-3">
              Ranking
            </th>
            <th scope="col" className="px-3 py-3">
              Total Lesson read
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardRanking &&
            leaderBoardRanking.length > 0 &&
            leaderBoardRanking.map((user, index) => (
              <tr key={user.email}>
                {' '}
                {/* or another unique identifier like user.id */}
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{index}</td>
                <td>{user.lessonCompleted}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
