'use client';
import { FC, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { CloseIcon } from '../components/UIElements';
import { en } from '@src/constants/lang/en';
import { noSpecialCharValidation } from '@src/utils/helpers';
import { z } from 'zod';
import useDashboardStore from '@src/store/dashboard.store';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldConfig } from '../types/formTypes';
import FormFieldsMapper from '../formElements/FormFieldsMapper';

interface AddEditRoadMapProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isAdd?: boolean;
  onSubmit: (data: AddEditRoadmapData) => void;
  isloading?: boolean;
  initialData?: AddEditRoadmapData;
}

const AddEditRoadmapSchema = z.object({
  name: z
    .string()
    .min(1, 'This field is mandatory')
    .max(200, 'The value should not exceed 200 character')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    })
    .refine(
      noSpecialCharValidation,
      'Only alphabets, numbers and space are allowed',
    ),
  description: z
    .string()
    .min(1, 'This field is mandatory')
    .max(5000, 'The value should not exceed 5000 character')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    }),
  roadmap_category_id: z.string().min(1, 'This field is mandatory'),
});

export type AddEditRoadmapData = z.infer<typeof AddEditRoadmapSchema>;

const AddEditRoadMapModal: FC<AddEditRoadMapProps> = ({
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

  const addEditRoadmapFields: FieldConfig[] = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Type roadmap name',
      className:
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
    },
    {
      label: 'Roadmap Category',
      name: 'roadmap_category_id',
      type: 'select',
      placeholder: 'Select category',
      options:
        contentRepositoryMetadata?.roadmap_categories.map((category) => ({
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
      placeholder: 'Write roadmap description here',
      height: '105px',
      width: '100%',
      className:
        'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700',
    },
  ];

  const methods = useForm<AddEditRoadmapData>({
    resolver: zodResolver(AddEditRoadmapSchema),
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
      setValue('roadmap_category_id', `${initialData.roadmap_category_id}`);
    }
  }, [open, reset, setValue, initialData]);

  return (
    <Modal show={open} popup>
      <Modal.Body className="p-4 sm:p-5">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b border-gray-200 sm:mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isAdd
              ? en.addEditRoadMapModal.addRoadmap
              : en.addEditRoadMapModal.editRoadmap}
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
            fields={addEditRoadmapFields}
            schema={AddEditRoadmapSchema}
            onSubmit={onSubmit}
            methods={methods}
            isLoading={isloading}
            buttonText={
              isAdd
                ? en.addEditRoadMapModal.addRoadmap
                : en.addEditRoadMapModal.editRoadmap
            }
            cancelButton={() => setOpen(false)}
            id="addRoadmapForm"
          />
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditRoadMapModal;
