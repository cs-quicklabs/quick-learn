'use client';

import React, {
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from 'react';
import {
  activateUser,
  getArchivedUsers,
  deleteUser,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { TUser } from '@src/shared/types/userTypes';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { en } from '@src/constants/lang/en';
import { toast } from 'react-toastify';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';

const LoadingSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <ArchivedCell
        key={i}
        isLoading={true}
        title=""
        subtitle=""
        deactivatedBy=""
        deactivationDate=""
        onClickDelete={() => null}
        onClickRestore={() => null}
      />
    ))}
  </>
);

const InactiveUsers = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [usersList, setUsersList] = useState<TUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
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
        toast.error('Error fetching users');
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
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
        setPage(1);
        await fetchUsers(1, searchValue, true);
        toast.success(en.successUserActivate);
      } catch (error) {
        toast.error(en.errorActivatingUser);
      } finally {
        setRestoreId(false);
      }
    },
    [fetchUsers, searchValue],
  );

  const handleDelete = useCallback(
    async (uuid: string) => {
      try {
        await deleteUser(uuid);
        setPage(1);
        await fetchUsers(1, searchValue, true);
        toast.success(en.successUserDelete);
      } catch (error) {
        toast.error(en.errorDeletingUser);
      } finally {
        setDeleteId(false);
      }
    },
    [fetchUsers, searchValue],
  );

  const handleQueryChange = useMemo(
    () =>
      debounce(async (value: string) => {
        const _value = value || '';
        try {
          setIsLoading(true);
          setSearchValue(_value);
          setPage(1);
          fetchUsers(1, _value, true);
        } catch (err) {
          console.log('Something went wrong!', err);
        }
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
            ? en.archivedSection.confirmActivateUser
            : en.archivedSection.confirmDeleteUser
        }
        subTitle={
          restoreId
            ? en.archivedSection.confirmActivateUserSubtext
            : en.archivedSection.confirmDeleteUserSubtext
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be set true
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId
            ? restoreUser(restoreId)
            : deleteId
            ? handleDelete(deleteId)
            : null
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        {en.archivedSection.inactiveUsers}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.archivedSection.inactiveUsersSubtext}
      </p>
      <SearchBox
        value={searchValue}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex flex-col w-full">
        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : usersList.length === 0 ? (
          <EmptyState type="users" searchValue={searchValue} />
        ) : (
          <InfiniteScroll
            dataLength={usersList.length}
            next={getNextUsers}
            hasMore={hasMore}
            loader={<LoadingSkeleton />}
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
        )}
      </div>
    </div>
  );
};

export default InactiveUsers;
