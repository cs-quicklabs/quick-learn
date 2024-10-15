'use client';

import React, { useEffect, useCallback, useState, ChangeEvent } from 'react';
import {
  activateUser,
  getArchivedUsers,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { Loader } from '@src/shared/components/UIElements';
import { TUser } from '@src/shared/types/userTypes';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUsersList] = useState<TUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(
    async (currentPage: number, search: string, resetList = false) => {
      setIsLoading(true);
      try {
        const res = await getArchivedUsers(currentPage, search);
        if (resetList || currentPage === 1) {
          setUsersList(res.data.items);
        } else {
          setUsersList((prev) => [...prev, ...res.data.items]);
        }
        setPage(res.data.page + 1);
        setHasMore(
          Boolean(res.data.total_pages) &&
            res.data.page !== res.data.total_pages,
        );
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getNextUsers = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchUsers(page, searchValue);
    }
  }, [fetchUsers, hasMore, isLoading, page, searchValue]);

  const restoreUser = useCallback(
    async (uuid: string) => {
      try {
        await activateUser({ active: true, uuid });
        // Reset the list and fetch from the first page
        setPage(1);
        await fetchUsers(1, searchValue, true);
      } catch (error) {
        console.error('Error restoring user:', error);
      }
    },
    [fetchUsers, searchValue],
  );

  const handleQueryChange = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
      setPage(1);
      fetchUsers(1, value, true);
    }, 300),
    [fetchUsers],
  );

  useEffect(() => {
    fetchUsers(1, '', true);
  }, [fetchUsers]);

  useEffect(() => console.log(usersList, page), [usersList]);

  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        Archived Users
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Following users have been deactivated.
      </p>
      <SearchBox
        value={searchValue}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex">
        <InfiniteScroll
          dataLength={usersList.length}
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
