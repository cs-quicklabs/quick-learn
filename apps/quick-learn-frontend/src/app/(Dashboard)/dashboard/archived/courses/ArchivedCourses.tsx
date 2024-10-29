'use client';

import React, {
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from 'react';
import {
  activateCourse,
  getArchivedCourses,
  deleteCourse,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TCourse } from '@src/shared/types/contentRepository';
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

const ArchivedCourses = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [coursesList, setCoursesList] = useState<TCourse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [restoreId, setRestoreId] = useState<string | false>(false);
  const [deleteId, setDeleteId] = useState<string | false>(false);

  const fetchCourses = useCallback(
    async (currentPage: number, search: string, resetList = false) => {
      setIsLoading(true);
      try {
        const res = await getArchivedCourses(currentPage, search);
        if (resetList || currentPage === 1) {
          setCoursesList(res.data.items);
        } else {
          setCoursesList((prev) => [...prev, ...res.data.items]);
        }
        setPage(res.data.page + 1);
        setHasMore(
          Boolean(res.data.total_pages) &&
            res.data.page !== res.data.total_pages,
        );
      } catch (error) {
        toast.error(en.common.noResultFound);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [],
  );

  const getNextCourses = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchCourses(page, searchValue);
    }
  }, [fetchCourses, hasMore, isLoading, page, searchValue]);

  const restoreCourse = useCallback(
    async (id: string) => {
      try {
        await activateCourse({ active: true, id: parseInt(id, 10) });
        setPage(1);
        await fetchCourses(1, searchValue, true);
        setRestoreId(false);
        toast.success(en.archivedSection.courseRestored);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      }
    },
    [fetchCourses, searchValue],
  );

  const handleDeleteCourse = useCallback(
    async (id: string) => {
      try {
        await deleteCourse(parseInt(id, 10));
        setPage(1);
        await fetchCourses(1, searchValue, true);
        setDeleteId(false);
        toast.success(en.archivedSection.courseDeleted);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      }
    },
    [fetchCourses, searchValue],
  );

  const handleQueryChange = useMemo(
    () =>
      debounce(async (value: string) => {
        const _value = value || '';
        try {
          setIsLoading(true);
          setSearchValue(_value);
          setPage(1);
          fetchCourses(1, _value, true);
        } catch (err) {
          toast.error(en.common.somethingWentWrong);
        }
      }, 300),
    [fetchCourses],
  );

  useEffect(() => {
    fetchCourses(1, '', true);
  }, [fetchCourses]);

  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <ConformationModal
        title={
          restoreId
            ? en.archivedSection.confirmActivateCourse
            : en.archivedSection.confirmDeleteCourse
        }
        subTitle={
          restoreId
            ? en.archivedSection.confirmActivateCourseSubtext
            : en.archivedSection.confirmDeleteCourseSubtext
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be set true
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId
            ? restoreCourse(restoreId)
            : deleteId && handleDeleteCourse(deleteId)
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        {en.archivedSection.archivedCourses}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.archivedSection.archivedCoursesSubtext}
      </p>
      <SearchBox
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex flex-col w-full min-h-[200px]">
        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : coursesList.length === 0 ? (
          <EmptyState type="courses" searchValue={searchValue} />
        ) : (
          <InfiniteScroll
            dataLength={coursesList.length}
            next={getNextCourses}
            hasMore={hasMore}
            loader={<LoadingSkeleton />}
            scrollThreshold={0.8}
            style={{ overflow: 'visible' }}
          >
            {coursesList.map((item) => (
              <ArchivedCell
                key={item.id}
                title={item.name}
                subtitle={item.course_category.name}
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
        )}
      </div>
    </div>
  );
};

export default ArchivedCourses;
