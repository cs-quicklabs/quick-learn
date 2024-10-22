'use client';

import React, { useEffect, useCallback, useState, ChangeEvent } from 'react';
import {
  activateUser,
  getArchivedUsers,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { TUser } from '@src/shared/types/userTypes';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';

const ArchivedUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUsersList] = useState<TUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restoreId, setRestoreId] = useState<string | false>(false);
  const [deleteId, setDeleteId] = useState<string | false>(false);

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

  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <ConformationModal
        title={
          restoreId
            ? 'Are you sure you want to activate this user?'
            : 'Are you sure you want to delete this user?'
        }
        subTitle={
          restoreId
            ? 'Once this user is activated, they will be able to access the system and perform actions based on their roles and permissions.'
            : 'All the information regarding this user will be lost. If this user has created some content, it will be assigned to the super admin.'
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be set true
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId ? restoreUser(restoreId) : console.log(deleteId)
        }
      />
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
          loader={isLoading && <FullPageLoader />}
        >
          {usersList.map((item) => (
            <ArchivedCell
              key={item.uuid}
              title={item.full_name || `${item.first_name} ${item.last_name}`}
              subtitle={item.skill.name}
              deactivatedBy={
                item.updated_by
                  ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                  : ''
              }
              deactivationDate={item.updated_at}
              onClickDelete={() => setDeleteId(item.uuid)}
              onClickRestore={() => setRestoreId(item.uuid)}
              alternateButton
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ArchivedUsers;
