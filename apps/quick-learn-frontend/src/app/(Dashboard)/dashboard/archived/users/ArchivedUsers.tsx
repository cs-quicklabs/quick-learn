'use client';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import InfiniteScrollComponent from '@src/shared/components/InfiniteScrollComponent';
import SearchBox from '@src/shared/components/SearchBox';
import { TArchivedUserType } from '@src/shared/types/archivedTypes';
import React, { useState } from 'react';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUserslist] = useState<TArchivedUserType[]>([]);
  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        Archived Users
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Following users have been deactivated.
      </p>
      <SearchBox value={searchValue} setValue={setSearchValue} />

      <InfiniteScrollComponent
        items={usersList.map((item) => (
          <>{item.first_name}</>
        ))}
        fetchData={() => console.log('ennd')}
      />
    </div>
  );
};

export default ArchivedUsers;
