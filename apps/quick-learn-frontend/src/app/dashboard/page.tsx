'use client';

import withAuth from '../../shared/pageTemplates/withAuth';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content here */}
    </div>
  );
};

export default withAuth(Dashboard);
