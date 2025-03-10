'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FullPageLoader, Loader } from '@src/shared/components/UIElements';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import { noSpecialCharValidation } from '@src/utils/helpers';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { en } from '@src/constants/lang/en';

type BaseType = {
  id: number | string;
  name: string;
};

type Props = {
  heading: string;
  subHeading: string;
  tableColumnName: string;
  input: {
    label: string;
    placeholder: string;
  };
  isAddLoading: boolean;
  isEditLoading: boolean;
  data: BaseType[];
  onAdd: (data: AddSchemaType) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: EditSchemaType) => void;
  isPageLoading?: boolean;
};

// Object to track timeouts for each deletion ID
interface DeletionTimeouts {
  [key: string]: NodeJS.Timeout;
}

const addSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'This field is mandatory')
    .max(30, 'The value should not exceed 30 characters.')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    })
    .refine(noSpecialCharValidation, 'Special characters are not allowed'),
});

type AddSchemaType = z.infer<typeof addSchema>;
type EditSchemaType = z.infer<typeof addSchema>;

function BaseLayout({
  heading,
  subHeading,
  tableColumnName,
  input,
  data,
  isAddLoading,
  isEditLoading,
  onDelete,
  onAdd,
  onEdit,
  isPageLoading = false,
}: Props) {
  const [list, setList] = useState<BaseType[]>([]);
  const [editRow, setEditRow] = useState<number>(-1);
  const [pendingDeletions, setPendingDeletions] = useState<
    Array<number | string>
  >([]);
  const deletionTimeoutsRef = useRef<DeletionTimeouts>({});

  useEffect(() => {
    setList(data);
  }, [data]);

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      // Cleanup all timeouts when component unmounts
      Object.values(deletionTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // This effect will help in detecting when items have been deleted
  useEffect(() => {
    // Check if any pending deletion IDs are no longer in the data
    if (pendingDeletions.length > 0) {
      const currentIds = data.map((item) => item.id);
      const completedDeletions = pendingDeletions.filter(
        (id) => !currentIds.includes(id),
      );

      if (completedDeletions.length > 0) {
        // Remove completed deletions from pending list
        setPendingDeletions((prev) =>
          prev.filter((id) => !completedDeletions.includes(id)),
        );

        // Clear timeouts for completed deletions
        completedDeletions.forEach((id) => {
          const idStr = String(id);
          if (deletionTimeoutsRef.current[idStr]) {
            clearTimeout(deletionTimeoutsRef.current[idStr]);
            delete deletionTimeoutsRef.current[idStr];
          }
        });
      }
    }
  }, [data, pendingDeletions]);

  const addFields: FieldConfig[] = [
    {
      label: input.label,
      name: 'name',
      type: 'text',
      placeholder: input.placeholder,
    },
  ];

  const addMethods = useForm<AddSchemaType>({
    resolver: zodResolver(addSchema),
  });

  const editMethods = useForm<EditSchemaType>({
    resolver: zodResolver(addSchema),
    mode: 'onChange',
  });

  const { reset: resetAdd } = addMethods;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    reset: resetEdit,
    trigger,
  } = editMethods;

  useEffect(() => {
    if (editRow > -1) {
      const currentValue = list[editRow].name;
      // Reset form and set initial values
      resetEdit();
      setValue('name', currentValue, {
        shouldDirty: false,
        shouldValidate: true,
      });
      // Trigger validation after setting value
      trigger('name');
    }
  }, [editRow, list, setValue, resetEdit, trigger]);

  const onEditClick = (index: number) => {
    // Reset the form before setting new editRow
    resetEdit();
    setEditRow(index);
  };

  const onSubmit = (data: AddSchemaType) => {
    onAdd(data);
    resetAdd();
  };

  const onEditSubmit = (data: EditSchemaType) => {
    const id = list[editRow].id as number;
    onEdit(id, data);
    setEditRow(-1);
    resetEdit();
  };

  const handleDelete = (id: number | string) => {
    // Add this ID to pending deletions
    setPendingDeletions((prev) => [...prev, id]);

    // Set a timeout to automatically clear this ID after 500ms
    // This handles the case where an error occurs and the deletion doesn't complete
    const idStr = String(id);
    if (deletionTimeoutsRef.current[idStr]) {
      clearTimeout(deletionTimeoutsRef.current[idStr]);
    }

    deletionTimeoutsRef.current[idStr] = setTimeout(() => {
      setPendingDeletions((prev) => prev.filter((item) => item !== id));
      delete deletionTimeoutsRef.current[idStr];
    }, 500);

    // Call the original onDelete function
    try {
      onDelete(id as number);
    } catch (error) {
      // If there's an error, we'll rely on the timeout to clear the pending state
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      {isPageLoading && <FullPageLoader />}
      <div>
        <h1 className="text-lg font-semibold">{heading}</h1>
        <p className="text-gray-500 text-sm mb-4">{subHeading}</p>
        <FormFieldsMapper
          fields={addFields}
          schema={addSchema}
          onSubmit={onSubmit}
          isLoading={isAddLoading}
          buttonText="Save"
          mode="onChange"
          resetFormOnSubmit
          id={heading.toLowerCase().replace(' ', '_')}
        />

        <form
          className="relative overflow-x-auto mt-8"
          onSubmit={handleSubmit(onEditSubmit)}
        >
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 w-full">
                  {tableColumnName}
                </th>
                <th scope="col" className="px-6 py-3">
                  {en.common.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => {
                const isBeingDeleted = pendingDeletions.includes(item.id);
                const isBeingEdited = editRow > -1 && editRow === index;

                return isBeingEdited ? (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td>
                        <input
                          type="text"
                          id={
                            heading.toLowerCase().replace(' ', '_') +
                            '_name_edit'
                          }
                          className="m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          {...register('name', {
                            onChange: () => {
                              trigger('name');
                            },
                          })}
                          disabled={isEditLoading}
                        />
                      </td>
                      <td>
                        <button
                          type="submit"
                          className="ml-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-gray-500"
                          disabled={isEditLoading || !isDirty || !isValid}
                        >
                          {isEditLoading ? <Loader /> : 'Save'}
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td>
                        {errors.name && (
                          <p className="px-2 mb-1 text-red-500 text-sm">
                            {errors.name.message}
                          </p>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ) : (
                  <tr
                    className="bg-white even:bg-gray-50 border-b border-gray-200"
                    key={item.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {item.name}
                    </th>
                    <td className="px-6 py-4 inline-flex">
                      <button
                        type="button"
                        className="font-medium text-blue-600 hover:underline disabled:text-gray-400 disabled:hover:no-underline"
                        onClick={() => onEditClick(index)}
                        disabled={isBeingDeleted}
                      >
                        {en.common.edit}
                      </button>
                      <button
                        type="button"
                        className="ml-2 font-medium text-red-600 hover:underline disabled:text-gray-400 disabled:hover:no-underline"
                        onClick={() => handleDelete(item.id)}
                        disabled={isBeingDeleted}
                      >
                        {en.common.delete}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
}

export default BaseLayout;
