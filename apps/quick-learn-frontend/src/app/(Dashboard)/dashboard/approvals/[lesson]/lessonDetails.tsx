'use client';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useDashboardStore from '@src/store/dashboard.store';
import { RouteEnum } from '@src/constants/route.enum';
import {
  approveLesson,
  getLessonDetails,
} from '@src/apiServices/lessonsService';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ViewLesson from '@src/shared/components/ViewLesson';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useRouter } from 'next/navigation';

const defaultLinks = [{ name: 'Approvals', link: RouteEnum.APPROVALS }];

const LessonDetails = () => {
  const { lesson: id } = useParams<{ lesson: string }>();
  const router = useRouter();

  // For hidding navbar
  const { setHideNavbar } = useDashboardStore((state) => state);
  useEffect(() => {
    setHideNavbar(true);
    return () => {
      setHideNavbar(false);
    };
  }, [setHideNavbar]);

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<TLesson>();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const links = useMemo<TBreadcrumb[]>(
    () =>
      !lesson
        ? defaultLinks
        : [
            ...defaultLinks,
            { name: lesson.name, link: `${RouteEnum.APPROVALS}/${lesson.id}` },
          ],
    [lesson],
  );

  useEffect(() => {
    if (isNaN(+id)) return;
    setLoading(true);
    getLessonDetails(id, false)
      .then((res) => {
        setLesson(res.data);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setLoading(false));
  }, [id]);

  function changeApproved(value: boolean) {
    if (isApproved) return;
    setIsApproved(value);
    setLoading(true);
    approveLesson(id)
      .then((res) => showApiMessageInToast(res))
      .catch((err) => showApiErrorInToast(err))
      .finally(() => {
        setLoading(false);
        router.back();
      });
  }

  if (!lesson) return null;

  return (
    <div className="-mt-8">
      {loading && <FullPageLoader />}
      <ViewLesson
        lesson={lesson}
        links={links}
        isApproved={isApproved}
        setIsApproved={changeApproved}
      />
    </div>
  );
};

export default LessonDetails;
