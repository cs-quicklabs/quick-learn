'use client';
import { z } from 'zod';
import { addMemberFormSchema } from './addFormSchema';
import { ErrorMessage, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { IMemberFieldConfig } from '../../../../shared/types/formTypes';

type AddMemberFormData = z.infer<typeof addMemberFormSchema>;

const AddMemberPage = () => {
  const addMemberFields: IMemberFieldConfig<AddMemberFormData>[] = [
    {
      label: 'First Name',
      name: 'first_name',
      type: 'text',
      placeholder: 'John',
    },
    {
      label: 'Last Name',
      name: 'last_name',
      type: 'text',
      placeholder: 'Doe',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'john.doe@gmail.com',
    },
    {
      label: 'User Role',
      name: 'user_type_id',
      type: 'select',
      tooltip:
        'A team member can be either Super Admin, Admin, Editor or Member',
    },
    {
      label: 'New Password',
      name: 'password',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      label: 'Confirm New Password',
      name: 'confirm_password',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      label: 'Primary Skill',
      name: 'skill_id',
      type: 'select',
    },
  ];

  const updatePasswordField = (index: number) => {
    fields[index]['showPassword'] = !fields[index]?.showPassword;
    setFields([...fields]);
  };

  const [fields, setFields] =
    useState<IMemberFieldConfig<AddMemberFormData>[]>(addMemberFields);

  return (
    <>
      <button
        data-tooltip-target="tooltip-default"
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Default tooltip
      </button>

      <div
        id="tooltip-default"
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Tooltip content
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
      <section className="mt-2 lg:mt-6 mx-auto max-w-2xl">
        <h1 className="text-lg font-semibold">Add New Team Member</h1>
        <p className="text-gray-600 text-sm">
          Please fill in details of new team member.
        </p>
        <Formik<AddMemberFormData>
          initialValues={{
            first_name: '',
            last_name: '',
            email: '',
            user_type_id: '',
            password: '',
            confirm_password: '',
            skill_id: '',
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
          validationSchema={toFormikValidationSchema(addMemberFormSchema)}
        >
          {({ handleChange, handleSubmit, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {fields.map(
                    (
                      { name, placeholder, type, label, showPassword, tooltip },
                      index,
                    ) => {
                      return (
                        <div key={name}>
                          <label
                            className="relative flex mb-2 text-sm font-medium text-gray-900"
                            htmlFor={name}
                          >
                            {label}
                            {/* TODO: Need to add tooltip */}
                          </label>
                          {type == 'select' ? (
                            <select
                              id={name}
                              name={name}
                              className="appearance-none block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
                              value={values[name]}
                              onChange={handleChange}
                            >
                              <option value="" disabled>
                                Select
                              </option>
                              <option value={'us'}>United States</option>
                              <option value={'us2'}>Canada</option>
                              <option value={'us3'}>Mexico</option>
                            </select>
                          ) : type == 'password' ? (
                            <div className="relative">
                              <input
                                id={name}
                                type={showPassword ? 'text' : 'password'}
                                className={`block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5`}
                                placeholder={placeholder}
                                value={values[name]}
                                onChange={handleChange}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => updatePasswordField(index)}
                              >
                                {showPassword ? (
                                  <EyeIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                ) : (
                                  <EyeSlashIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                )}
                              </button>
                            </div>
                          ) : (
                            <input
                              id={name}
                              type={type}
                              className={`block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5`}
                              placeholder={placeholder}
                              onChange={handleChange}
                              value={values[name]}
                            />
                          )}
                          <ErrorMessage
                            name={name}
                            component="p"
                            className="mt-1 text-red-500 text-sm"
                          />
                        </div>
                      );
                    },
                  )}
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-2"
                >
                  Cancel
                </button>
              </form>
            );
          }}
        </Formik>
      </section>
    </>
  );
};

export default AddMemberPage;
