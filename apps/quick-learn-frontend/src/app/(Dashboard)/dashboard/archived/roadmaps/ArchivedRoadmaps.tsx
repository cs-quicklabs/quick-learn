'use client';

import React, { useEffect, useCallback, useState, ChangeEvent } from 'react';
import {
  activateUser,
  getArchivedRoadmaps,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TRoadmap } from '@src/shared/types/contentRepository';

const ArchivedRoadmaps = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [roadmapsList, setRoadmapsList] = useState<TRoadmap[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restoreId, setRestoreId] = useState<string | false>(false);
  const [deleteId, setDeleteId] = useState<string | false>(false);

  const fetchRoadmaps = useCallback(
    async (currentPage: number, search: string, resetList = false) => {
      setIsLoading(true);
      try {
        const res = await getArchivedRoadmaps(currentPage, search);
        if (resetList || currentPage === 1) {
          setRoadmapsList(res.data.items);
        } else {
          setRoadmapsList((prev) => [...prev, ...res.data.items]);
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
      fetchRoadmaps(page, searchValue);
    }
  }, [fetchRoadmaps, hasMore, isLoading, page, searchValue]);

  const restoreUser = useCallback(
    async (uuid: string) => {
      try {
        await activateUser({ active: true, uuid });
        // Reset the list and fetch from the first page
        setPage(1);
        await fetchRoadmaps(1, searchValue, true);
      } catch (error) {
        console.error('Error restoring user:', error);
      }
    },
    [fetchRoadmaps, searchValue],
  );

  const handleQueryChange = useCallback(
    (value: string) => {
      debounce(() => {
        setSearchValue(value);
        setPage(1);
        fetchRoadmaps(1, value, true);
      }, 300);
    },
    [fetchRoadmaps],
  );

  useEffect(() => {
    fetchRoadmaps(1, '', true);
  }, [fetchRoadmaps]);

  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <ConformationModal
        title={
          restoreId
            ? 'Are you sure you want to restore this roadmap?'
            : 'Are you sure you want to delete this roadmap?'
        }
        subTitle={
          restoreId
            ? 'Once this roadmaps is restored, users will be able to see it and if they made some progress on it in the past, that will also be restored.'
            : 'All the information regarding this roadmap will be lost. If this was assigned to any user, users will not be able to access this roadmap anymore, their progress will be lost. This is not reversible.'
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be set true
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId ? restoreUser(restoreId) : console.log(deleteId)
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        Archived Roadmaps
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Following roadmaps have been archived.
      </p>
      <SearchBox
        value={searchValue}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex">
        <InfiniteScroll
          dataLength={roadmapsList.length}
          next={getNextUsers}
          hasMore={hasMore}
          loader={isLoading && <FullPageLoader />}
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
              onClickDelete={() => setDeleteId(item.id)}
              onClickRestore={() => setRestoreId(item.id)}
              alternateButton
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ArchivedRoadmaps;
