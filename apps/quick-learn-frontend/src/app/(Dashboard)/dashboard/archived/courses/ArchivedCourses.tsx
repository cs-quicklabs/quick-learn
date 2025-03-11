'use client';

import React, { useEffect, useState } from 'react';
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
import { RouteEnum } from '@src/constants/route.enum';
import { useRouter } from 'next/navigation';

function ArchivedCourses() {
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
  const router = useRouter();

  const getNextCourses = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchArchivedCourses({ page, search: searchValue }));
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await dispatch(deleteArchivedCourse({ id: parseInt(id, 10) })).unwrap();
      toast.success(en.archivedSection.courseDeleted);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      setDeleteId(false);
    }
  };

  const restoreCourse = async (id: string) => {
    try {
      await dispatch(activateArchivedCourse({ id: parseInt(id, 10) })).unwrap();
      toast.success(en.archivedSection.courseRestored);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      setRestoreId(false);
    }
  };

  const handleQueryChange = debounce(async (value: string) => {
    const searchText = value || '';
    try {
      dispatch(setCoursesSearchValue(searchText));
      dispatch(
        fetchArchivedCourses({
          page: 1,
          search: searchText,
          resetList: true,
        }),
      );
    } catch (err) {
      console.log(err);
      toast.error(en.common.somethingWentWrong);
    }
  }, 300);

  useEffect(() => {
    dispatch(fetchArchivedCourses({ page: 1, search: '', resetList: true }));
  }, [dispatch]);

  return (
    <div className="max-w-[43rem] px-4 pb-12 lg:col-span-8">
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
      <div className="flex flex-col w-full">
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
                onClickDelete={() => setDeleteId(String(item.id))}
                onClickRestore={() => setRestoreId(String(item.id))}
                onClickNavigate={() => {
                  router.push(`${RouteEnum.ARCHIVED_COURSES}/${item.id}`);
                }}
                alternateButton
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default ArchivedCourses;
