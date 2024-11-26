'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchArchivedRoadmaps,
  activateArchivedRoadmap,
  deleteArchivedRoadmap,
  selectArchivedRoadmaps,
  setRoadmapsSearchValue,
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

const ArchivedRoadmaps = () => {
  const dispatch = useAppDispatch();
  const {
    items: roadmapsList,
    isLoading,
    isInitialLoad,
    hasMore,
    page,
    searchValue,
  } = useAppSelector(selectArchivedRoadmaps);

  const [restoreId, setRestoreId] = useState<number | false>(false);
  const [deleteId, setDeleteId] = useState<number | false>(false);

  const getNextRoadmaps = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchArchivedRoadmaps({ page, search: searchValue }));
    }
  }, [dispatch, hasMore, isLoading, page, searchValue]);

  const handleDeleteRoadmap = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteArchivedRoadmap({ id })).unwrap();
        dispatch(
          fetchArchivedRoadmaps({
            page: 1,
            search: searchValue,
            resetList: true,
          }),
        );
        toast.success(en.archivedSection.roadmapDeletedSuccess);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      } finally {
        setDeleteId(false);
      }
    },
    [dispatch, searchValue],
  );

  const restoreRoadmap = useCallback(
    async (id: number) => {
      try {
        await dispatch(activateArchivedRoadmap({ id })).unwrap();
        dispatch(
          fetchArchivedRoadmaps({
            page: 1,
            search: searchValue,
            resetList: true,
          }),
        );
        toast.success(en.archivedSection.roadmapRestoredSuccess);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
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
          dispatch(setRoadmapsSearchValue(_value));
          dispatch(
            fetchArchivedRoadmaps({ page: 1, search: _value, resetList: true }),
          );
        } catch (err) {
          toast.error(en.common.somethingWentWrong);
        }
      }, 300),
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchArchivedRoadmaps({ page: 1, search: '', resetList: true }));
  }, [dispatch]);

  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <ConformationModal
        title={
          restoreId
            ? en.archivedSection.confirmActivateRoadmap
            : en.archivedSection.confirmDeleteRoadmap
        }
        subTitle={
          restoreId
            ? en.archivedSection.confirmActivateRoadmapSubtext
            : en.archivedSection.confirmDeleteRoadmapSubtext
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be 'true'
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId
            ? restoreRoadmap(restoreId)
            : handleDeleteRoadmap(deleteId as number)
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        {en.archivedSection.archivedRoadmaps}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.archivedSection.archivedRoadmapsSubtext}
      </p>
      <SearchBox
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex flex-col w-full min-h-[200px]">
        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : roadmapsList.length === 0 ? (
          <EmptyState type="roadmaps" searchValue={searchValue} />
        ) : (
          <InfiniteScroll
            dataLength={roadmapsList.length}
            next={getNextRoadmaps}
            hasMore={hasMore}
            loader={<LoadingSkeleton />}
            scrollThreshold={0.8}
            style={{ overflow: 'visible' }}
          >
            {roadmapsList.map((item) => (
              <ArchivedCell
                key={item.id}
                title={item.name}
                subtitle={item.roadmap_category.name}
                deactivatedBy={
                  item.updated_by
                    ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                    : ''
                }
                deactivationDate={item.updated_at}
                onClickDelete={() => setDeleteId(Number(item.id))}
                onClickRestore={() => setRestoreId(Number(item.id))}
                alternateButton
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default ArchivedRoadmaps;
