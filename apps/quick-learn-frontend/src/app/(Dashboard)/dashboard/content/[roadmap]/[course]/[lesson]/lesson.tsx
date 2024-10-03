'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLesson,
  getRoadmap,
} from '@src/apiServices/contentRepositoryService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Editor from '@src/shared/components/Editor';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import useDashboardStore from '@src/store/dashboard.store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, en.lesson.titleRequired)
    .max(50, en.lesson.titleMaxLength),
  content: z.string().trim().min(1, en.lesson.contentRequired),
});

const Lesson = () => {
  const router = useRouter();
  const {
    roadmap: roadmapId,
    course: courseId,
    lesson: lessonId,
  } = useParams<{
    roadmap: string;
    course: string;
    lesson: string;
  }>();
  const { setHideNavbar } = useDashboardStore((state) => state);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [loading, setLoading] = useState<boolean>(false);

  // form settings
  type LessonSchemaType = z.infer<typeof lessonSchema>;
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
  });

  useEffect(() => {
    setHideNavbar(true);
    return () => {
      setHideNavbar(false);
    };
  });

  useEffect(() => {
    const url = `${RouteEnum.CONTENT}/${roadmapId}/${courseId}/${lessonId}`;
    if (lessonId !== 'add') {
      // TODO: get lesson
    } else if (roadmapId) {
      getRoadmap(roadmapId, courseId)
        .then((res) => {
          setLinks([
            ...defaultlinks,
            { name: res.data.name, link: `${RouteEnum.CONTENT}/${roadmapId}` },
            {
              name: res.data.courses[0].name,
              link: `${RouteEnum.CONTENT}/${roadmapId}/${courseId}`,
            },
            { name: en.common.addLesson, link: url },
          ]);
        })
        .catch((err) => showApiErrorInToast(err));
    } else {
      setLinks([...defaultlinks, { name: en.common.addLesson, link: url }]);
    }
  }, [roadmapId, courseId, lessonId]);

  function onSubmit(data: LessonSchemaType) {
    setLoading(true);
    createLesson({ ...data, course_id: courseId })
      .then((res) => {
        showApiMessageInToast(res);
        router.replace(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="mx-auto max-w-screen-lg bg-white -mt-4">
        <Breadcrumb links={links} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <textarea
                  {...field}
                  className="w-full text-3xl md:text-4xl font-bold text-center md:h-20 h-10 border-none overflow-y-auto resize-none md:p-4"
                  placeholder={en.common.addTitlePlaceholder}
                  readOnly={!isEditing}
                />
                {error && (
                  <p className="mt-1 text-red-500 text-sm">{error.message}</p>
                )}
              </>
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Editor
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  value={field.value}
                  setValue={field.onChange}
                />
                {error && (
                  <p className="mt-1 text-red-500 text-sm">{error.message}</p>
                )}
              </>
            )}
          />
          <button
            type="submit"
            className="fixed bottom-4 right-4 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500"
            disabled={!isDirty || !isValid}
          >
            {en.common.lessonSaveAndApprovalButton}
          </button>
        </form>
      </div>
    </>
  );
};

export default Lesson;
