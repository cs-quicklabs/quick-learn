'use client';
import { getArchivedUsers } from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { Loader } from '@src/shared/components/UIElements';
import { TUser } from '@src/shared/types/userTypes';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUserslist] = useState<TUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const getNextUsers = () => {
    getArchivedUsers(page, searchValue).then((res) => {
      console.log(res);
      setUserslist((prev) => [...prev, ...res.data.items]);
      setPage(page + 1);
      setHasMore(res.data.page !== res.data.total_pages);
    });
  };
  useEffect(() => {
    getNextUsers();
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
        <InfiniteScroll
          dataLength={usersList.length} //This is important field to render the next data
          next={getNextUsers}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {usersList.map((item) => (
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
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ArchivedUsers;
