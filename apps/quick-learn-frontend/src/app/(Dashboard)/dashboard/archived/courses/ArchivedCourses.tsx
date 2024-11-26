'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import {
  fetchArchivedCourses,
  activateArchivedCourse,
  deleteArchivedCourse,
  selectArchivedCourses,
  setCoursesSearchValue,
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

const ArchivedCourses = () => {
  const dispatch = useAppDispatch();
  const {
    items: coursesList,
    isLoading,
    isInitialLoad,
    hasMore,
    page,
    searchValue,
  } = useAppSelector(selectArchivedCourses);

  const [restoreId, setRestoreId] = useState<string | false>(false);
  const [deleteId, setDeleteId] = useState<string | false>(false);

  const getNextCourses = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchArchivedCourses({ page, search: searchValue }));
    }
  }, [dispatch, hasMore, isLoading, page, searchValue]);

  const handleDeleteCourse = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteArchivedCourse({ id: parseInt(id, 10) })).unwrap();
        dispatch(
          fetchArchivedCourses({
            page: 1,
            search: searchValue,
            resetList: true,
          }),
        );
        toast.success(en.archivedSection.courseDeleted);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      } finally {
        setDeleteId(false);
      }
    },
    [dispatch, searchValue],
  );

  const restoreCourse = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          activateArchivedCourse({ id: parseInt(id, 10) }),
        ).unwrap();
        dispatch(
          fetchArchivedCourses({
            page: 1,
            search: searchValue,
            resetList: true,
          }),
        );
        toast.success(en.archivedSection.courseRestored);
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
          dispatch(setCoursesSearchValue(_value));
          dispatch(
            fetchArchivedCourses({ page: 1, search: _value, resetList: true }),
          );
        } catch (err) {
          toast.error(en.common.somethingWentWrong);
        }
      }, 300),
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchArchivedCourses({ page: 1, search: '', resetList: true }));
  }, [dispatch]);

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
        handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
