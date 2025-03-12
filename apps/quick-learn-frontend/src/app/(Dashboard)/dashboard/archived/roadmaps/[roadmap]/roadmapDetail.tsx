'use client';
import { getRoadmap } from '@src/apiServices/contentRepositoryService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Card from '@src/shared/components/Card';

import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TCourse, TRoadmap } from '@src/shared/types/contentRepository';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRoadmapById,
  updateRoadmap as updateStoreRoadmap,
} from '@src/store/features/roadmapsSlice';
import { AppDispatch } from '@src/store/store';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoadmapDetailsSkeleton from './roadmapDetailsSkeleton';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { AxiosErrorObject } from '@src/apiServices/axios';
import ArchivedDialogbox from '@src/shared/components/ArchivedDialogBox';
import ConformationModal from '@src/shared/modals/conformationModal';
import {
  activateArchivedRoadmap,
  deleteArchivedRoadmap,
} from '@src/store/features';
import { toast } from 'react-toastify';

const defaultlinks: TBreadcrumb[] = [
  {
    name: en.contentRepository.archiveRoadmap,
    link: RouteEnum.ARCHIVED_ROADMAPS,
  },
];

function RoadmapDetails() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { roadmap: roadmapId } = useParams<{ roadmap: string }>();
  const [restoreId, setRestoreId] = useState<number | false>(false);
  const [deleteId, setDeleteId] = useState<number | false>(false);

  // Get roadmap from store
  const roadmapFromStore = useSelector(
    selectRoadmapById(parseInt(roadmapId, 10)),
  );

  const [roadmapData, setRoadmapData] = useState<TRoadmap | undefined>(
    roadmapFromStore,
  );
  const [courses, setCourses] = useState<TCourse[]>(
    roadmapFromStore?.courses || [],
  );
  const [links, setLinks] = useState<TBreadcrumb[]>(() => {
    if (roadmapFromStore) {
      return [
        ...defaultlinks,
        {
          name: roadmapFromStore.name,
          link: `${RouteEnum.CONTENT}/${roadmapId}`,
        },
      ];
    }
    return defaultlinks;
  });

  const handleDeleteRoadmap = async (id: number) => {
    try {
      await dispatch(deleteArchivedRoadmap({ id })).unwrap();
      toast.success(en.archivedSection.roadmapDeletedSuccess);
      router.push(RouteEnum.ARCHIVED_ROADMAPS);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      setDeleteId(false);
    }
  };

  const restoreRoadmap = async (id: number) => {
    try {
      await dispatch(activateArchivedRoadmap({ id })).unwrap();
      toast.success(en.archivedSection.roadmapRestoredSuccess);
      router.push(RouteEnum.ARCHIVED_ROADMAPS);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      setRestoreId(false);
    }
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await getRoadmap(roadmapId, undefined, true);
        const fetchedRoadmap = res.data;
        setRoadmapData(fetchedRoadmap);
        setCourses(fetchedRoadmap.courses || []);
        setLinks([
          ...defaultlinks,
          {
            name: fetchedRoadmap.name,
            link: `${RouteEnum.CONTENT}/${roadmapId}`,
          },
        ]);
        dispatch(updateStoreRoadmap(fetchedRoadmap));
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
      }
    };

    if (!parseInt(roadmapId, 10)) {
      router.replace(RouteEnum.CONTENT);
      return;
    }

    fetchRoadmap();
  }, [roadmapId, dispatch, router]);

  if (!roadmapFromStore && !roadmapData) {
    return <RoadmapDetailsSkeleton />;
  }

  if (!roadmapData) {
    return null;
  }

  const hasCourses = courses.length > 0;

  return (
    <>
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
      <div className="flex flex-col items-center">
        <ArchivedDialogbox
          type="Roadmap"
          archivedBy={
            roadmapData.updated_by
              ? `${roadmapData.updated_by.first_name} ${roadmapData.updated_by.last_name}`
              : 'Unknown'
          }
          archivedAt={roadmapData.updated_at}
          onRestore={() => setRestoreId(parseInt(roadmapId, 10))} // Show confirmation modal for restore
          onDelete={() => setDeleteId(parseInt(roadmapId, 10))}
        />
      </div>
      <Breadcrumb links={links} />
      <div className="container mx-auto px-4">
        {/* Roadmap Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold first-letter:uppercase mb-2 text-center">
            {roadmapData.name}
          </h1>
          <p className="text-sm text-gray-500 text-center">
            <span className="capitalize">
              {roadmapData.created_by
                ? `${roadmapData.created_by.first_name} ${roadmapData.created_by.last_name}`
                : 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisRoadmapOn}&nbsp;
            {roadmapData.created_at &&
              format(roadmapData.created_at, DateFormats.shortDate)}
          </p>
          <p className="text-sm text-gray-500 text-center">
            {roadmapData.description}
          </p>
          <p className="text-sm text-gray-500 text-center">
            ({roadmapData.courses?.length ?? 0} {en.contentRepository.courses},
            &nbsp;
            {roadmapData.courses?.reduce(
              (acc, curr) => acc + (curr?.lessons_count ?? 0),
              0,
            ) ?? 0}{' '}
            {en.common.lessons}, &nbsp;
            {roadmapData.userCount ?? 0} {en.common.participants})
          </p>
        </div>

        {/* Courses Section */}
        <div className="px-4">
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {en.contentRepository.allCourses}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({roadmapData.courses?.length ?? 0} {en.contentRepository.courses}
              )
            </p>
          </div>
          {hasCourses ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              {courses.map((item) => (
                <Card
                  key={item.id}
                  id={String(item.id)}
                  title={item.name}
                  description={item.description}
                  stats={`${item.lessons_count || 0} ${en.common.lessons}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="courses"
              customTitle={en.contentRepository.noCourses}
              customDescription={en.contentRepository.noCoursesDescription}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RoadmapDetails;
