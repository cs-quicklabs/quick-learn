'use client';
import {
  addRoadmapCategory,
  getRoadmapCategories,
} from '@src/apiServices/accountService';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { TRoadmapCategories } from '@src/shared/types/accountTypes';
import { FieldConfig } from '@src/shared/types/formTypes';
import { onlyAlphabeticAndSpaceValidation } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

const addRoadmapCategorySchema = z.object({
  newRoadmapCategory: z
    .string()
    .min(1, 'This field is mandatory')
    .max(30, 'This field should be less than or equal to 30')
    .refine((value) => value.trim().length > 0, {
      message: 'This field is mandatory and cannot contain only whitespace',
    })
    .refine(
      onlyAlphabeticAndSpaceValidation,
      'Only alphabets and space are allowed',
    ),
});

type AddRoadmapCategoryData = z.infer<typeof addRoadmapCategorySchema>;

const Roadmapcategories = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roadmapCategories, setRoadmapCategories] = useState<
    TRoadmapCategories[]
  >([]);
  const addRoadmapCategoryFields: FieldConfig[] = [
    {
      label: 'Add New Roadmap Category',
      name: 'newRoadmapCategory',
      type: 'text',
      placeholder: 'Engineering',
    },
  ];

  const onSubmit = (data: AddRoadmapCategoryData) => {
    setIsLoading(true);
    const payload = { name: data.newRoadmapCategory, team_id: 1 };
    addRoadmapCategory(payload)
      .then((res) => {
        showApiMessageInToast(res);
        setRoadmapCategories(res.data.categories);
        console.log(res.data);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    getRoadmapCategories()
      .then((res) => {
        setRoadmapCategories(res.data.categories);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold dark:text-white">
          Roadmap Categories
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Roadmaps can belong to a category. A category could be a way to group
          learning roadmaps. For example, a department can have a category
          called &quot;Engineering&quot; and all the roadmaps related to
          engineering can be added to this category.
        </p>
        <FormFieldsMapper
          fields={addRoadmapCategoryFields}
          schema={addRoadmapCategorySchema}
          onSubmit={onSubmit}
          isLoading={isLoading}
          resetFormOnSubmit
          buttonText="Save"
        />
        <div className="relative overflow-x-auto mt-8">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 w-full">
                  Category name
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {roadmapCategories.map((categories) => (
                <tr
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  key={categories.name}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {categories.name}
                  </th>
                  <td className="px-6 py-4 inline-flex">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="ml-2 font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Roadmapcategories;
