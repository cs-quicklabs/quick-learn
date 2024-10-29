'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLesson,
  getRoadmap,
} from '@src/apiServices/contentRepositoryService';
import {
  getLessonDetails,
  updateLesson,
} from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import { UserContext } from '@src/context/userContext';
import AutoResizingTextarea from '@src/shared/components/AutoResizingTextArea';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Editor from '@src/shared/components/Editor';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson, TRoadmap } from '@src/shared/types/contentRepository';
import useDashboardStore from '@src/store/dashboard.store';
import { debounce } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { UserTypeIdEnum } from 'lib/shared/src';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

type CreateLessonPayload = {
  name: string;
  content: string;
  course_id: string;
};

const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, en.lesson.titleRequired)
    .max(80, en.lesson.titleMaxLength),
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

  // get User
  const { user } = useContext(UserContext);
  const isAdmin = [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
    user?.user_type_id ?? -1,
  );

  // For hidding navbar
  const { setHideNavbar } = useDashboardStore((state) => state);
  useEffect(() => {
    setHideNavbar(true);
    return () => {
      setHideNavbar(false);
    };
  }, [setHideNavbar]);

  const [isEditing, setIsEditing] = useState<boolean>(lessonId === 'add');
  const [lesson, setLesson] = useState<TLesson>();
  const [roadmap, setRoadmap] = useState<TRoadmap>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // To set the links for the breadcrumb
  const links = useMemo<TBreadcrumb[]>(() => {
    const url = `${RouteEnum.CONTENT}/${roadmapId}/${courseId}/${lessonId}`;
    if (!roadmap) {
      return [
        ...defaultlinks,
        {
          name: lesson?.course?.name ?? 'Course',
          link: `${RouteEnum.CONTENT}/${roadmapId}/${courseId}`,
        },
        { name: lesson?.name ?? en.common.addLesson, link: url },
      ];
    }
    return [
      ...defaultlinks,
      { name: roadmap.name, link: `${RouteEnum.CONTENT}/${roadmapId}` },
      {
        name: roadmap.courses[0].name,
        link: `${RouteEnum.CONTENT}/${roadmapId}/${courseId}`,
      },
      { name: lesson?.name ?? en.common.addLesson, link: url },
    ];
  }, [roadmap, lesson, roadmapId, courseId, lessonId]);

  // form settings
  type LessonSchemaType = z.infer<typeof lessonSchema>;
  const {
    setValue,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
  } = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!(isNaN(+roadmapId) || isNaN(+courseId))) {
      getRoadmap(roadmapId, courseId)
        .then((res) => setRoadmap(res.data))
        .catch((err) => showApiErrorInToast(err));
    }
    if (lessonId !== 'add') {
      getLessonDetails(lessonId)
        .then((res) => {
          setLesson(res.data);
          setValue('name', res.data.name);
          setValue('content', res.data.new_content || res.data.content);
        })
        .catch((err) => showApiErrorInToast(err));
    }
  }, [roadmapId, courseId, lessonId, setValue]);

  function onSubmit(data: LessonSchemaType) {
    setLoading(true);
    if (lessonId === 'add') onAdd(data);
    else onEdit(true);
  }

  function onAdd(data: LessonSchemaType) {
    setIsEditing(false);

    createLesson({
      ...data,
      course_id: courseId,
    } as CreateLessonPayload)
      .then((res) => {
        showApiMessageInToast(res);
        router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setLoading(false));
  }

  const onEdit = useCallback(
    (redirect = false) => {
      if (lessonId === 'add') return;
      updateLesson(lessonId, {
        content: getValues('content'),
        name: getValues('name').trim().slice(0, 50),
      })
        .then((res) => {
          if (!res.success) throw res;
          if (redirect) {
            showApiMessageInToast(res);
            router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
          }
        })
        .catch((err) => {
          if (redirect) {
            showApiErrorInToast(err);
          } else console.log(err);
        })
        .finally(() => setIsUpdating(false));
    },
    [lessonId, getValues, router, roadmapId, courseId],
  );

  const updateContent = useMemo(() => {
    return debounce(onEdit, 2000);
  }, [onEdit]);

  function onChange(field: 'name' | 'content', value: string) {
    setIsUpdating(true);
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    updateContent();
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
                <AutoResizingTextarea
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  isEditing={isEditing}
                  placeholder={en.common.addTitlePlaceholder}
                  maxLength={80} // Matches your zod schema validation
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
                  setValue={(e) => onChange(field.name, e)}
                  isUpdating={isUpdating}
                  isAdd={lessonId === 'add'}
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
            {isAdmin
              ? en.common.saveAndPublish
              : en.common.lessonSaveAndApprovalButton}
          </button>
        </form>
      </div>
    </>
  );
};

export default Lesson;
