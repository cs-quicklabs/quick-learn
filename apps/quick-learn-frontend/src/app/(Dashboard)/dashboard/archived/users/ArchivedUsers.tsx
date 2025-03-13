'use client';

import React, { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@src/constants/route.enum';

function InactiveUsers() {
  const dispatch = useAppDispatch();
  const {
    items: usersList,
    isLoading,
    isInitialLoad,
    hasMore,
    page,
    searchValue,
  } = useAppSelector(selectArchivedUsers);

  const [restoreId, setRestoreId] = useState<number | false>(false);
  const [deleteId, setDeleteId] = useState<number | false>(false);
  const router = useRouter();

  const getNextUsers = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchArchivedUsers({ page, search: searchValue }));
    }
  };
  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteArchivedUser({ userId: +userId })).unwrap();
      toast.success(en.successUserDelete);
    } catch (error) {
      console.log(error);
      toast.error(en.errorDeletingUser);
    } finally {
      setDeleteId(false);
    }
  };
  const restoreUser = async (userId: number) => {
    try {
      await dispatch(activateArchivedUser({ userId })).unwrap();
      toast.success(en.successUserActivate);
    } catch (error) {
      console.log(error);
      toast.error(en.errorActivatingUser);
    } finally {
      setRestoreId(false);
    }
  };

  const handleQueryChange = debounce(async (value: string) => {
    const searchText = value || '';
    try {
      dispatch(setUsersSearchValue(searchText));
      dispatch(
        fetchArchivedUsers({
          page: 1,
          search: searchText,
          resetList: true,
        }),
      );
    } catch (err) {
      console.log('Something went wrong!', err);
    }
  }, 300);

  useEffect(() => {
    dispatch(fetchArchivedUsers({ page: 1, search: '', resetList: true }));
  }, [dispatch]);

  function renderComponentUI() {
    if (isInitialLoad) return <LoadingSkeleton />;

    if (usersList.length === 0)
      return <EmptyState type="users" searchValue={searchValue} />;

    return (
      <InfiniteScroll
        dataLength={usersList.length}
        next={getNextUsers}
        hasMore={hasMore}
        loader={<LoadingSkeleton />}
      >
        {usersList.map((item) => (
          <ArchivedCell
            key={item.id}
            title={item.full_name || `${item.first_name} ${item.last_name}`}
            subtitle={item.skill.name}
            deactivatedBy={
              item.updated_by
                ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                : ''
            }
            deactivationDate={item.updated_at}
            onClickDelete={() => setDeleteId(item.id)}
            onClickRestore={() => setRestoreId(item.id)}
            onClickNavigate={() =>
              router.push(`${RouteEnum.ARCHIVED_USERS}/${item.id}`)
            }
            alternateButton
          />
        ))}
      </InfiniteScroll>
    );
  }

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
      <div className="flex flex-col w-full">{renderComponentUI()}</div>
    </div>
  );
}

export default InactiveUsers;
