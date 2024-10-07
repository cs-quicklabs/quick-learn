'use client';
import SearchBox from '@src/shared/components/SearchBox';
import React, { useState } from 'react';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        Archived Users
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Following users have been deactivated.
      </p>
      <SearchBox value={searchValue} setValue={setSearchValue} />{' '}
    </div>
  );
};

export default ArchivedUsers;
