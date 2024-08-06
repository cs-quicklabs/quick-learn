import React from 'react';
import AccountSettingsPage from './Accountsettings';
import Sidebar from '@src/shared/components/Sidebar';

export const metadata = {
  title: 'Account Settings • Quick Learn',
  description: 'Account settings quick learn',
};

const Accountsettings = () => {
  return (
    <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        {/* Sidebar */}
        <aside className="px-2 py-6 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <Sidebar />
        </aside>
        {/* Main Section */}
        <main className="max-w-xl pb-12 px-4 lg:col-span-6">
          <AccountSettingsPage />
        </main>
      </div>
    </main>
  );
};

export default Accountsettings;
