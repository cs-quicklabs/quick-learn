'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { activateLesson } from '@src/apiServices/archivedService';
import { AxiosErrorObject } from '@src/apiServices/axios';
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
import ConformationModal from '@src/shared/modals/conformationModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TLesson, TRoadmap } from '@src/shared/types/contentRepository';
import useDashboardStore from '@src/store/dashboard.store';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { UserTypeIdEnum } from 'lib/shared/src';
import { useParams, useRouter } from 'next/navigation';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

// Schema definition
const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, en.lesson.titleRequired)
    .max(80, en.lesson.titleMaxLength),
  content: z.string().trim().min(1, en.lesson.contentRequired),
});

type LessonFormData = z.infer<typeof lessonSchema>;

// Constants
const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

// Memoized Components
const SaveButton = memo(
  ({ isAdmin, disabled }: { isAdmin: boolean; disabled: boolean }) => (
    <button
      type="submit"
      className="fixed bottom-4 right-4 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500"
      disabled={disabled}
    >
      {isAdmin
        ? en.common.saveAndPublish
        : en.common.lessonSaveAndApprovalButton}
    </button>
  ),
);

SaveButton.displayName = 'SaveButton';

const ArchiveButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    className="fixed bottom-4 left-4 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500"
    onClick={onClick}
  >
    {en.common.Archive}
  </button>
));

ArchiveButton.displayName = 'ArchiveButton';

// Custom Hooks
const useLessonForm = (initialData?: Partial<LessonFormData>) => {
  const {
    setValue,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    mode: 'onChange',
    defaultValues: initialData,
  });

  const handleChange = useCallback(
    (field: keyof LessonFormData, value: string) => {
      setValue(field, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue],
  );

  return {
    control,
    handleSubmit,
    isDirty,
    isValid,
    getValues,
    handleChange,
  };
};

const useNavbarManagement = () => {
  const { setHideNavbar } = useDashboardStore();

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);
};

const useLessonData = (
  roadmapId: string,
  courseId: string,
  lessonId: string,
) => {
  const [lesson, setLesson] = useState<TLesson>();
  const [roadmap, setRoadmap] = useState<TRoadmap>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!(isNaN(+roadmapId) || isNaN(+courseId))) {
          const roadmapData = await getRoadmap(roadmapId, courseId);
          setRoadmap(roadmapData.data);
        }

        if (lessonId !== 'add') {
          const lessonData = await getLessonDetails(lessonId);
          setLesson(lessonData.data);
        }
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roadmapId, courseId, lessonId]);

  return { lesson, roadmap, loading };
};

const Lesson = () => {
  const router = useRouter();
  const params = useParams<{
    roadmap: string;
    course: string;
    lesson: string;
  }>();
  const { roadmap: roadmapId, course: courseId, lesson: lessonId } = params;

  const { user } = useContext(UserContext);
  const isAdmin = useMemo(
    () =>
      [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
        user?.user_type_id ?? -1,
      ),
    [user?.user_type_id],
  );

  // Custom hooks
  useNavbarManagement();
  const { lesson, roadmap, loading } = useLessonData(
    roadmapId,
    courseId,
    lessonId,
  );
  const [isEditing, setIsEditing] = useState<boolean>(lessonId === 'add');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const form = useLessonForm({
    name: lesson?.name,
    content: lesson?.new_content || lesson?.content,
  });

  // Memoized values
  const links = useMemo(() => {
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
  }, [
    roadmap,
    lesson?.course?.name,
    lesson?.name,
    roadmapId,
    courseId,
    lessonId,
  ]);

  // Handlers
  const updateContent = useCallback(
    async (field: keyof LessonFormData, value: string) => {
      if (lessonId === 'add') return;

      try {
        setIsUpdating(true);
        const res = await updateLesson(lessonId, {
          [field]: value.trim(),
        });
        if (!res.success) throw res;
      } catch (err) {
        console.error(err);
      } finally {
        setIsUpdating(false);
      }
    },
    [lessonId],
  );

  const onChange = useCallback(
    (field: keyof LessonFormData, value: string) => {
      form.handleChange(field, value);
      const timeoutId = setTimeout(() => updateContent(field, value), 1000);
      return () => clearTimeout(timeoutId);
    },
    [form.handleChange, updateContent],
  );

  const onSubmit: SubmitHandler<LessonFormData> = useCallback(
    async (data) => {
      try {
        if (lessonId === 'add') {
          setIsEditing(false);
          const res = await createLesson({
            ...data,
            course_id: courseId,
          });
          showApiMessageInToast(res);
          router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
        } else {
          const res = await updateLesson(lessonId, {
            content: data.content,
            name: data.name.trim().slice(0, 50),
          });
          if (!res.success) throw res;
          showApiMessageInToast(res);
          router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
        }
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
      }
    },
    [lessonId, courseId, roadmapId, router],
  );

  const handleArchiveLesson = useCallback(async () => {
    if (lessonId === 'add') return;

    try {
      setIsArchiving(true);
      const response = await activateLesson({
        id: parseInt(lessonId),
        active: false,
      });
      showApiMessageInToast(response);
      router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
    } catch (err) {
      showApiErrorInToast(err as AxiosErrorObject);
    } finally {
      setIsArchiving(false);
    }
  }, [lessonId, roadmapId, courseId, router]);

  if (loading || isArchiving) {
    return <FullPageLoader />;
  }

  return (
    <div className="mx-auto max-w-screen-lg bg-white -mt-4">
      <Breadcrumb links={links} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <>
              <AutoResizingTextarea
                value={field.value}
                onChange={(e) => onChange('name', e.target.value)}
                isEditing={isEditing}
                placeholder={en.common.addTitlePlaceholder}
                maxLength={80}
              />
              {error && (
                <p className="mt-1 text-red-500 text-sm">{error.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Editor
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                value={field.value}
                setValue={(e) => onChange('content', e)}
                isUpdating={isUpdating}
                isAdd={lessonId === 'add'}
              />
              {error && (
                <p className="mt-1 text-red-500 text-sm">{error.message}</p>
              )}
            </>
          )}
        />

        <SaveButton
          isAdmin={isAdmin}
          disabled={!form.isDirty || !form.isValid || !isEditing}
        />
      </form>

      {lessonId !== 'add' && isAdmin && (
        <ArchiveButton onClick={() => setShowArchiveModal(true)} />
      )}

      <ConformationModal
        title={en.lesson.archiveConfirmHeading}
        subTitle={en.lesson.archiveConfirmDescription}
        open={showArchiveModal}
        setOpen={setShowArchiveModal}
        onConfirm={handleArchiveLesson}
      />
    </div>
  );
};

export default memo(Lesson);
