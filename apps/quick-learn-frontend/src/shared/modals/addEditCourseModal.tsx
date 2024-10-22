'use client';
import { FC, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { CloseIcon } from '../components/UIElements';
import { en } from '@src/constants/lang/en';
import { z } from 'zod';
import useDashboardStore from '@src/store/dashboard.store';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldConfig } from '../types/formTypes';
import FormFieldsMapper from '../formElements/FormFieldsMapper';

interface AddEditCourseProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isAdd?: boolean;
  onSubmit: (data: AddEditCourseData) => void;
  isloading?: boolean;
  initialData?: AddEditCourseData;
}

const AddEditCourseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'This field is mandatory')
    .max(50, 'The value should not exceed 50 character')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    }),
  description: z
    .string()
    .trim()
    .min(1, 'This field is mandatory')
    .max(5000, 'The value should not exceed 5000 character')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    }),
  course_category_id: z.string().min(1, 'This field is mandatory'),
  is_community_available: z.boolean(),
});

export type AddEditCourseData = z.infer<typeof AddEditCourseSchema>;

const AddEditCourseModal: FC<AddEditCourseProps> = ({
  open,
  setOpen,
  isAdd = true,
  onSubmit,
  isloading = false,
  initialData,
}) => {
  const contentRepositoryMetadata = useDashboardStore(
    (state) => state.metadata.contentRepository,
  );

  const AddEditCourseFields: FieldConfig[] = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Type course name',
      className:
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
    },
    {
      label: 'Course Category',
      name: 'course_category_id',
      type: 'select',
      placeholder: 'Select category',
      options:
        contentRepositoryMetadata?.course_categories.map((category) => ({
          value: category.id,
          label: category.name,
        })) || [],
      className:
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 capitalize',
    },
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Write course description here',
      height: '105px',
      width: '100%',
      className:
        'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700',
    },
    {
      label: 'Make this course public and available for community.',
      sub_label:
        'If checked, this will make this course available to all organizations and their users. If unchecked, only your organization users will be able to access this course. Please do this carefully and never make any confidential course public.',
      name: 'is_community_available',
      type: 'checkbox',
    },
  ];

  const methods = useForm<AddEditCourseData>({
    resolver: zodResolver(AddEditCourseSchema),
    mode: 'onChange',
  });

  const { reset, setValue } = methods;

  useEffect(() => {
    if (!open) {
      reset();
    }
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description);
      setValue('course_category_id', `${initialData.course_category_id}`);
      setValue('is_community_available', initialData.is_community_available);
    }
  }, [open, reset, setValue, initialData]);

  return (
    <Modal show={open} popup>
      <Modal.Body className="p-4 sm:p-5">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b border-gray-200 sm:mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isAdd
              ? en.addEditCourseModal.addCourse
              : en.addEditCourseModal.editCourse}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
        <FormProvider {...methods}>
          <FormFieldsMapper
            fields={AddEditCourseFields}
            schema={AddEditCourseSchema}
            onSubmit={onSubmit}
            methods={methods}
            isLoading={isloading}
            buttonText={
              isAdd
                ? en.addEditCourseModal.addCourse
                : en.addEditCourseModal.editCourse
            }
            cancelButton={() => setOpen(false)}
            id="addCourseForm"
          />
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditCourseModal;
