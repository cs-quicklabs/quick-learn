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
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TCourse } from '@src/shared/types/contentRepository';
import { en } from '@src/constants/lang/en';
import { toast } from 'react-toastify';

const ArchivedCourses = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [coursesList, setCoursesList] = useState<TCourse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        // Reset the list and fetch from the first page
        setPage(1);
        await fetchCourses(1, searchValue, true);
        setRestoreId(false);
      } catch (error) {
        toast.error(en.common.noResultFound);
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
          fetchCourses(1, _value, true).finally(() => setIsLoading(false));
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
      {isLoading && <FullPageLoader />}
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
          restoreId ? restoreCourse(restoreId) : console.log(deleteId)
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        {en.archivedSection.archivedCourses}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.archivedSection.archivedCoursesSubtext}
      </p>
      <SearchBox
        value={searchValue}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex">
        <InfiniteScroll
          dataLength={coursesList.length}
          next={getNextCourses}
          hasMore={hasMore}
          loader={isLoading && <FullPageLoader />}
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
      </div>
    </div>
  );
};

export default ArchivedCourses;
