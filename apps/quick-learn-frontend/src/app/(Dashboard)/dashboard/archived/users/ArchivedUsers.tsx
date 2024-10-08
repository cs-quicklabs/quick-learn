'use client';
import { getArchivedUsers } from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import InfiniteScrollComponent from '@src/shared/components/InfiniteScrollComponent';
import SearchBox from '@src/shared/components/SearchBox';
import { TUser } from '@src/shared/types/userTypes';
import React, { useEffect, useState } from 'react';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUserslist] = useState<TUser[]>([]);
  useEffect(() => {
    getArchivedUsers({}).then((res) => {
      console.log(res);
      setUserslist(res.data);
    });
  }, []);
  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        Archived Users
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Following users have been deactivated.
      </p>
      <SearchBox value={searchValue} setValue={setSearchValue} />
      <div className="flex">
        <InfiniteScrollComponent
          items={usersList.map((item) => (
            <ArchivedCell
              key={item.uuid}
              title={item.full_name}
              subtitle={item.skill.name}
              deactivatedBy="Aasish Dhawan"
              deactivationDate={item.updated_at}
              onClickDelete={() => console.log(item.uuid)}
              onClickRestore={() => console.log(item)}
            />
          ))}
          fetchData={() => console.log('ennd')}
        />
      </div>
    </div>
  );
};

export default ArchivedUsers;
