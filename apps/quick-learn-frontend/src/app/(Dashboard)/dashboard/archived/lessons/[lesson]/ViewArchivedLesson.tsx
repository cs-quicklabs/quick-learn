'use client';
import { getLessonDetails } from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import ArchivedDialogbox from '@src/shared/components/ArchivedDialogbox';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
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
  const { lesson } = useParams<{ lesson: string }>();
  const id = lesson;
  const [loading, setLoading] = useState(true);
  const [currlesson, setCurrLesson] = useState<TLesson>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const defaultLinks = [{ name: 'Home', link: RouteEnum.ARCHIVED_LESSONS }];

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
    setLoading(true);
    getLessonDetails(id)
      .then((res) => setCurrLesson(res.data))
      .catch((err) => {
        showApiErrorInToast(err);
        router.push(RouteEnum.ARCHIVED_LESSONS);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const restoreLesson = async () => {
    setLoading(true);
    try {
      await dispatch(activateArchivedLesson({ id: +id })).unwrap();

      toast.success(en.archivedSection.lessonRestoredSuccess);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      router.push(RouteEnum.ARCHIVED_LESSONS);
      setLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    setLoading(true);
    try {
      await dispatch(deleteArchivedLesson({ id: +id })).unwrap();
      toast.success(en.archivedSection.lessonDeletedSuccess);
    } catch (error) {
      console.log(error);
      toast.error(en.common.somethingWentWrong);
    } finally {
      router.push(RouteEnum.ARCHIVED_LESSONS);
      setLoading(false);
    }
  };

  if (!currlesson) return null;
  return (
    <div>
      {loading && <FullPageLoader />}
      <div className="flex justify-center mb-4">
        <ArchivedDialogbox
          type="lesson"
          onClickRestore={restoreLesson}
          onClickDelete={handleDeleteLesson}
          isLoading={loading}
        />
      </div>
      <ViewLesson lesson={currlesson} links={links} disableLink={true} />
    </div>
  );
};

export default ViewArchivedLesson;
