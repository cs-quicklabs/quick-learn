import React from 'react';
import LeaderboardTable from './LeaderboardTable';

const LeaderboardTemplate = () => {
  return (
    <section className="relative bg-white shadow-md sm:rounded-md">
      <div>
        <h1 className="text-lg font-semibold px-3">LEADERBOARD</h1>
      </div>
      <div>
        <p className="text-gray-500 text-sm px-3">
          Weekly records of Last last week
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
