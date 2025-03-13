/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { memo, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { activateLesson } from '@src/apiServices/archivedService';
import { AxiosErrorObject } from '@src/apiServices/axios';
import {
  createLesson,
  getCourse,
  getRoadmap,
} from '@src/apiServices/contentRepositoryService';
import {
  getLessonDetails,
  updateLesson,
} from '@src/apiServices/lessonsService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import AutoResizingTextarea from '@src/shared/components/AutoResizingTextArea';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Editor from '@src/shared/components/Editor';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import {
  TCourse,
  TLesson,
  TRoadmap,
} from '@src/shared/types/contentRepository';
import { setHideNavbar } from '@src/store/features/uiSlice';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { UserTypeIdEnum } from 'lib/shared/src';
import { z } from 'zod';
import {
  selectRoadmapById,
  updateRoadmap,
} from '@src/store/features/roadmapsSlice';
import { selectUser } from '@src/store/features/userSlice';
import { useAppSelector } from '@src/store/hooks';

// Move constants outside component to prevent recreating on each render
const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, en.lesson.titleRequired)
    .max(80, en.lesson.titleMaxLength),
  content: z.string().trim().min(1, en.lesson.contentRequired),
});
type LessonFormData = z.infer<typeof lessonSchema>;

// Separate components for better performance
const SaveButton = ({
  isAdmin,
  disabled,
}: {
  isAdmin: boolean;
  disabled: boolean;
}) => (
  <button
    type="submit"
    className="fixed bottom-4 right-4 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500"
    disabled={disabled}
  >
    {isAdmin ? en.common.saveAndPublish : en.common.lessonSaveAndApprovalButton}
  </button>
);

SaveButton.displayName = 'SaveButton';

const ArchiveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    className="fixed bottom-4 left-4 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500"
    onClick={onClick}
  >
    {en.common.Archive}
  </button>
);

ArchiveButton.displayName = 'ArchiveButton';

// Custom hook for form logic
const useLessonForm = () => {
  const {
    setValue,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    mode: 'onChange',
  });

  return {
    setValue,
    control,
    handleSubmit,
    isDirty,
    isValid,
    getValues,
  };
};

function Lesson() {
  const router = useRouter();
  const dispatch = useDispatch();
  const path = usePathname();
  const params = useParams<{
    roadmap: string;
    course: string;
    lesson: string;
  }>();
  const queryParams = useSearchParams();
  const isToolbarOpen = queryParams.get('edit');

  const { roadmap: roadmapId, course: courseId, lesson: lessonId } = params;

  // Context and state remain the same
  const user = useSelector(selectUser);
  const isAdmin = [UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN].includes(
    user?.user_type_id ?? -1,
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(
    lessonId === 'add' || path.includes('edit') || isToolbarOpen === 'true',
  );
  const [lesson, setLesson] = useState<TLesson>();
  const [roadmap, setRoadmap] = useState<TRoadmap>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const form = useLessonForm();

  const isEdit = useMemo(() => {
    return (
      path.includes('edit') && user?.user_type_id !== UserTypeIdEnum.MEMBER
    );
  }, [path]);

  // Memoize links calculation
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
  // Optimize initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!(isNaN(+roadmapId) || isNaN(+courseId))) {
          const roadmapData = await getRoadmap(roadmapId, courseId);
          setRoadmap(roadmapData.data);
        }

        if (lessonId !== 'add') {
          const lessonData = await getLessonDetails(lessonId, !isEdit);
          setLesson(lessonData.data);
          form.setValue('name', lessonData.data.name);
          form.setValue(
            'content',
            lessonData.data.new_content || lessonData.data.content,
          );
        }
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
        router.replace(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
      }
    };

    fetchData();
  }, [roadmapId, courseId, lessonId, form.setValue]);

  // Optimize navbar effect
  useEffect(() => {
    dispatch(setHideNavbar(true));

    // Return cleanup function that dispatches the action
    return () => {
      dispatch(setHideNavbar(false));
    };
  }, [dispatch]);

  const roadmapFromStore = useAppSelector(
    selectRoadmapById(parseInt(roadmapId, 10)),
  );

  const onSubmit = useCallback<SubmitHandler<LessonFormData>>(
    async (data) => {
      setLoading(true);
      try {
        if (lessonId === 'add') {
          setIsEditing(false);
          const res = await createLesson({
            ...data,
            course_id: courseId,
          });

          // Get updated course data with new lesson
          const courseRes = await getCourse(courseId);

          // Update roadmap in store with new course data
          if (roadmapFromStore) {
            const roadmapData: TRoadmap = {
              ...roadmapFromStore,
              courses: roadmapFromStore.courses.map((c: TCourse) =>
                c.id === parseInt(courseId, 10) ? courseRes.data : c,
              ),
            };
            dispatch(updateRoadmap(roadmapData));
          }

          showApiMessageInToast(res);
          router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
        } else {
          const res = await updateLesson(lessonId, {
            content: data.content,
            name: data.name.trim().slice(0, 80),
          });
          if (!res.success) throw res;
          showApiMessageInToast(res);
          router.push(`${RouteEnum.CONTENT}/${roadmapId}/${courseId}`);
        }
      } catch (err) {
        showApiErrorInToast(err as AxiosErrorObject);
      } finally {
        setLoading(false);
      }
    },
    [lessonId, courseId, roadmapId, router],
  );
  // Debounced update with useCallback
  const updateContent = useCallback(
    async (field: 'name' | 'content', value: string) => {
      if (lessonId === 'add') return;

      // Get current server-side value for comparison
      const currentValue =
        field === 'content'
          ? (lesson?.new_content ?? lesson?.content ?? '')
          : (lesson?.name ?? '');

      // Skip the update if values are the same
      if (value.trim() === currentValue.trim()) {
        setIsUpdating(false);
        return;
      }

      try {
        const res = await updateLesson(lessonId, {
          [field]: value.trim(),
        });
        if (!res.success) throw res;

        // Update the local lesson object to reflect the new value
        if (field === 'content') {
          setLesson((prev) =>
            prev ? { ...prev, new_content: value.trim() } : prev,
          );
        } else {
          setLesson((prev) => (prev ? { ...prev, name: value.trim() } : prev));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsUpdating(false);
      }
    },
    [lessonId, lesson],
  );

  // Optimize onChange handler
  const onChange = useCallback(
    (field: 'name' | 'content', value: string) => {
      const currentValue =
        field === 'content'
          ? (lesson?.new_content ?? lesson?.content ?? '')
          : (lesson?.name ?? '');

      form.setValue(field, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      // Clear existing timeout
      if (value !== currentValue && lessonId !== 'add') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setIsUpdating(true);
        // Set new timeout for 2 seconds after user stops typing
        timeoutRef.current = setTimeout(() => {
          updateContent(field, value);
        }, 2000);
      }
    },
    [form.setValue, updateContent],
  );

  //Cleans up pending timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleArchiveLesson = useCallback(async () => {
    if (lessonId === 'add') return;

    try {
      setIsArchiving(true);
      const response = await activateLesson({
        id: parseInt(lessonId, 10),
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

  return (
    <div className="-mt-4">
      {(loading || isArchiving) && <FullPageLoader />}
      <Breadcrumb links={links} />
      <div className="mx-auto max-w-screen-lg bg-white">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <>
                <AutoResizingTextarea
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
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
                  setValue={(newValue) => {
                    onChange(field.name, newValue);
                    field.onChange(newValue);
                  }}
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
    </div>
  );
}

export default memo(Lesson);
