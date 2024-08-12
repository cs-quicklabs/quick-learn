'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { addRoadmapCategory } from '@src/apiServices/accountService';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const addRoadmapCategorySchema = z.object({
  newRoadmapCategory: z.string().min(1, 'This field is mandatory'),
});

type AddRoadmapCategoryData = z.infer<typeof addRoadmapCategorySchema>;

const Roadmapcategories = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addRoadmapCategoryFields: FieldConfig[] = [
    {
      label: 'Add New Roadmap Category',
      name: 'newRoadmapCategory',
      type: 'text',
      placeholder: 'Engineering',
    },
  ];
  const methods = useForm<AddRoadmapCategoryData>({
    resolver: zodResolver(addRoadmapCategorySchema),
  });
  const { reset } = methods;
  const onSubmit = (data: AddRoadmapCategoryData) => {
    setIsLoading(true);
    const payload = { name: data.newRoadmapCategory, team_id: 1 };
    addRoadmapCategory(payload)
      .then((res) => {
        showApiMessageInToast(res);
        reset();
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };

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
          methods={methods}
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
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  HR
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
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Sales
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
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"></tr>
              <tr>
                <th className="p-2">
                  <input
                    type="text"
                    id="last_name"
                    className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Engineering"
                    value="Engineering"
                    required
                  />
                </th>
                <td>
                  <button
                    type="submit"
                    className="text-white ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save
                  </button>
                </td>
              </tr>
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-t">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Recruitment
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Roadmapcategories;
