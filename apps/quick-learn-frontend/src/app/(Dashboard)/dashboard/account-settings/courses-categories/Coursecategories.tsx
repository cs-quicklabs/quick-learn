'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCourseCategory } from '@src/apiServices/accountService';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const addCourseCategorySchema = z.object({
  newCourseCategory: z.string().min(1, 'This field is mandatory'),
});

type AddCourseCategoryData = z.infer<typeof addCourseCategorySchema>;

const Coursecategories = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const addCourseCategoryFields: FieldConfig[] = [
    {
      label: 'Add New Course Category',
      name: 'newCourseCategory',
      type: 'text',
      placeholder: 'Software Application',
    },
  ];
  const methods = useForm<AddCourseCategoryData>({
    resolver: zodResolver(addCourseCategorySchema),
  });
  const { reset } = methods;
  const onSubmit = (data: AddCourseCategoryData) => {
    setIsLoading(true);
    const payload = { name: data.newCourseCategory };
    addCourseCategory(payload)
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
          Courses Categories
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Courses can belong to a category. A category could be a way to group
          learning courses. For example, a you can create a learning course from
          a book, a blog, a video, for a software application or for any
          onboarding needs.
        </p>
        <FormFieldsMapper
          fields={addCourseCategoryFields}
          schema={addCourseCategorySchema}
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
                  Book
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
                  Software Application
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
                    value="Production Deployment"
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
                  Recruitment Process
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

export default Coursecategories;
