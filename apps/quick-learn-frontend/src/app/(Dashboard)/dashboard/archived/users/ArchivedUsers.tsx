'use client';
import {
  activateUser,
  getArchivedUsers,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { Loader } from '@src/shared/components/UIElements';
import { TUser } from '@src/shared/types/userTypes';
import { debounce } from '@src/utils/helpers';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUserslist] = useState<TUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getNextUsers = () => {
    getArchivedUsers(page, searchValue).then((res) => {
      setUserslist((prev) => [...prev, ...res.data.items]);
      setPage(page + 1);
      setHasMore(
        Boolean(res.data.total_pages) && res.data.page !== res.data.total_pages,
      );
    });
  };

  const restoreUser = (uuid: string) => {
    activateUser({ active: true, uuid }).then(() => {
      getArchivedUsers(1, searchValue).then((res) => {
        console.log(res);
        setUserslist(res.data.items);
        setPage(1);
        setHasMore(
          Boolean(res.data.total_pages) &&
            res.data.page !== res.data.total_pages,
        );
      });
    });
  };

  const handleQueryChange = useMemo(
    () =>
      debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const _value = (e.target as HTMLInputElement).value || '';
        try {
          setSearchValue(_value);
          setPage(1);
        } catch (err) {
          console.log('Something went wrong!', err);
        }
      }, 300),
    [],
  );

  useEffect(() => {
    getArchivedUsers(1, searchValue).then((res) => {
      console.log(res);
      setUserslist(res.data.items);
      setPage(1);
      setHasMore(
        Boolean(res.data.total_pages) && res.data.page !== res.data.total_pages,
      );
    });
  }, [searchValue]);

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
      <SearchBox value={searchValue} handleChange={handleQueryChange} />
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
              onClickRestore={() => restoreUser(item.uuid)}
              alternateButton
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ArchivedUsers;
