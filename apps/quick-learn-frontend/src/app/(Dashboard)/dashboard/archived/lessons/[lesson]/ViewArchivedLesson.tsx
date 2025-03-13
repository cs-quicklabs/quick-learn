'use client';
import { getLessonDetails } from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import ArchivedBanner from '@src/shared/components/ArchivedBanner';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  activateArchivedLesson,
  deleteArchivedLesson,
} from '@src/store/features';
import { useAppDispatch } from '@src/store/hooks';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ViewArchivedLesson = () => {
  const { lesson: id } = useParams<{ lesson: string }>();
  const [confirmationData, setConfirmationData] = useState<{
    type: 'restore' | 'delete';
  } | null>(null);
  const [currlesson, setCurrLesson] = useState<TLesson>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const defaultLinks = [
    { name: 'Archived Lesson', link: RouteEnum.ARCHIVED_LESSONS },
  ];

  const links: TBreadcrumb[] = !currlesson
    ? defaultLinks
    : [
        ...defaultLinks,
        {
          name: currlesson.course.name,
          link: `${RouteEnum.CONTENT}/courses/${currlesson.course_id}`,
        },
        {
          name: currlesson.name,
          link: `${RouteEnum.FLAGGED}/${currlesson.id}`,
        },
      ];

  useEffect(() => {
    if (isNaN(+id)) return;
    getLessonDetails(id, true, true)
      .then((res) => setCurrLesson(res.data))
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(RouteEnum.ARCHIVED_LESSONS);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleConfirmation = async () => {
    if (!confirmationData) return;

    try {
      if (confirmationData.type === 'restore') {
        await dispatch(activateArchivedLesson({ id: +id })).unwrap();
        toast.success(en.archivedSection.lessonRestoredSuccess);
      } else {
        await dispatch(deleteArchivedLesson({ id: +id })).unwrap();
        toast.success(en.archivedSection.lessonDeletedSuccess);
      }
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      router.push(RouteEnum.ARCHIVED_LESSONS);
      setConfirmationData(null);
    }
  };

  if (!currlesson) return <FullPageLoader />;
  return (
    <div className="px-4 -mt-8">
      <ConformationModal
        title={
          confirmationData?.type === 'restore'
            ? en.archivedSection.confirmActivateLesson
            : en.archivedSection.confirmDeleteLesson
        }
        subTitle={
          confirmationData?.type === 'restore'
            ? en.archivedSection.confirmActivateLessonSubtext
            : en.archivedSection.confirmDeleteLessonSubtext
        }
        open={Boolean(confirmationData)}
        setOpen={() => setConfirmationData(null)}
        onConfirm={handleConfirmation}
      />
      <div className="flex justify-center mb-4 relative">
        <ArchivedBanner
          type="lesson"
          archivedAt={currlesson.updated_at}
          archivedBy={
            currlesson?.archive_by_user?.display_name ?? 'SUPER ADMIN'
          }
          onRestore={() => setConfirmationData({ type: 'restore' })}
          onDelete={() => setConfirmationData({ type: 'delete' })}
        />
      </div>
      <ViewLesson lesson={currlesson} links={links} />
    </div>
  );
};

export default ViewArchivedLesson;
