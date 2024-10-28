'use client';

import React, {
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from 'react';
import {
  activateRoadmap,
  getArchivedRoadmaps,
  deleteRoadmap,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TRoadmap } from '@src/shared/types/contentRepository';
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

const ArchivedRoadmaps = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [roadmapsList, setRoadmapsList] = useState<TRoadmap[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [restoreId, setRestoreId] = useState<number | false>(false);
  const [deleteId, setDeleteId] = useState<number | false>(false);

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
        setHasMore(res.data.page < res.data.total_pages);
      } catch (error) {
        toast.error(en.common.noResultFound);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [],
  );

  const getNextRoadmaps = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchRoadmaps(page, searchValue);
    }
  }, [fetchRoadmaps, hasMore, isLoading, page, searchValue]);

  const handleDeleteRoadmap = useCallback(
    async (id: number) => {
      try {
        await deleteRoadmap(id);
        setPage(1);
        await fetchRoadmaps(1, searchValue, true);
        setDeleteId(false);
        toast.success(en.archivedSection.roadmapDeletedSuccess);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      }
    },
    [fetchRoadmaps, searchValue],
  );

  const restoreRoadmap = useCallback(
    async (id: number) => {
      try {
        await activateRoadmap({ active: true, id });
        setPage(1);
        await fetchRoadmaps(1, searchValue, true);
        setRestoreId(false);
        toast.success(en.archivedSection.roadmapRestoredSuccess);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      }
    },
    [fetchRoadmaps, searchValue],
  );

  const handleQueryChange = useMemo(
    () =>
      debounce(async (value: string) => {
        const _value = value || '';
        try {
          setIsLoading(true);
          setSearchValue(_value);
          setPage(1);
          fetchRoadmaps(1, _value, true);
        } catch (err) {
          toast.error(en.common.somethingWentWrong);
        }
      }, 300),
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
        value={searchValue}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
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
