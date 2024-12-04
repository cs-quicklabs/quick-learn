'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchArchivedUsers,
  activateArchivedUser,
  deleteArchivedUser,
  selectArchivedUsers,
  setUsersSearchValue,
} from '@src/store/features/archivedSlice';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { en } from '@src/constants/lang/en';
import { toast } from 'react-toastify';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { LoadingSkeleton } from '@src/shared/components/UIElements';

const InactiveUsers = () => {
  const dispatch = useAppDispatch();
  const {
    items: usersList,
    isLoading,
    isInitialLoad,
    hasMore,
    page,
    searchValue,
  } = useAppSelector(selectArchivedUsers);

  const [restoreId, setRestoreId] = useState<string | false>(false);
  const [deleteId, setDeleteId] = useState<string | false>(false);

  const getNextUsers = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchArchivedUsers({ page, search: searchValue }));
    }
  }, [dispatch, hasMore, isLoading, page, searchValue]);

  const handleDeleteUser = useCallback(
    async (uuid: string) => {
      try {
        await dispatch(deleteArchivedUser({ uuid })).unwrap();
        dispatch(
          fetchArchivedUsers({ page: 1, search: searchValue, resetList: true }),
        );
        toast.success(en.successUserDelete);
      } catch (error) {
        toast.error(en.errorDeletingUser);
      } finally {
        setDeleteId(false);
      }
    },
    [dispatch, searchValue],
  );

  const restoreUser = useCallback(
    async (uuid: string) => {
      try {
        await dispatch(activateArchivedUser({ uuid })).unwrap();
        dispatch(
          fetchArchivedUsers({ page: 1, search: searchValue, resetList: true }),
        );
        toast.success(en.successUserActivate);
      } catch (error) {
        toast.error(en.errorActivatingUser);
      } finally {
        setRestoreId(false);
      }
    },
    [dispatch, searchValue],
  );

  const handleQueryChange = useMemo(
    () =>
      debounce(async (value: string) => {
        const _value = value || '';
        try {
          dispatch(setUsersSearchValue(_value));
          dispatch(
            fetchArchivedUsers({ page: 1, search: _value, resetList: true }),
          );
        } catch (err) {
          console.log('Something went wrong!', err);
        }
      }, 300),
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchArchivedUsers({ page: 1, search: '', resetList: true }));
  }, [dispatch]);

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
            : deleteId && handleDeleteUser(deleteId)
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        {en.archivedSection.inactiveUsers}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.archivedSection.inactiveUsersSubtext}
      </p>
      <SearchBox
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
