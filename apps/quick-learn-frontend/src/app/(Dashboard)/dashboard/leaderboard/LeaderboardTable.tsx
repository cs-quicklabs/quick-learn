import { en } from '@src/constants/lang/en';
import React from 'react';

const LeaderboardTable = () => {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
          <tr>
            <th scope="col" className="px-4 py-3">
              S.No
            </th>
            <th scope="col" className="px-4 py-3">
              {en.teams.User}
            </th>
            <th scope="col" className="px-4 py-3">
              {en.teams.Role}
            </th>
            <th scope="col" className="px-4 py-3">
              {en.teams.Email}
            </th>

            <th scope="col" className="px-4 py-3">
              {en.teams.Status}
            </th>
            <th scope="col" className="px-3 py-3 text-nowrap">
              {en.teams.lastLogin}
            </th>
            <th scope="col" className="px-3 py-3">
              Total Lesson read
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default LeaderboardTable;
