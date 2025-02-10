import React from 'react';
import LeaderboardTable from './LeaderboardTable';
import { en } from '@src/constants/lang/en';

const LeaderboardTemplate = () => {
  return (
    <section className="relative bg-white shadow-md sm:rounded-md">
      <div>
        <h1 className="text-lg font-semibold px-3 pt-3">
          {en.leaderboard.leaderboard}
        </h1>
      </div>
      <div>
        <p className="text-gray-500 text-sm px-3">
          {en.leaderboard.leaderboardDescription}
        </p>
      </div>
      {/* table */}
      <div className="mt-4">
        <LeaderboardTable />
      </div>
    </section>
  );
};

export default LeaderboardTemplate;
