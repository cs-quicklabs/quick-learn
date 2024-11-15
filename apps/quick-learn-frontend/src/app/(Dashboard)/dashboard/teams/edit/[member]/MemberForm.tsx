import React from 'react';
import { useForm, Controller, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { RouteEnum } from '@src/constants/route.enum';
import { useParams, useRouter } from 'next/navigation';
import { Loader, ShowInfoIcon } from '@src/shared/components/UIElements';
import { Tooltip } from 'flowbite-react';
import { z } from 'zod';

export interface IMemberFieldConfig<T> {
  label: string;
  name: keyof T;
  type: 'text' | 'email' | 'password' | 'select';
  placeholder?: string;
  showPassword?: boolean;
  tooltip?: string;
  options?: { name: string; value: string | number; id?: string | number }[];
}

export interface IMemberForm<T extends z.ZodTypeAny> {
  readonly formFields: IMemberFieldConfig<z.infer<T>>[];
  readonly onSubmit: (data: z.infer<T>) => void;
  readonly initialValues: z.infer<T>;
  readonly schema: T;
  readonly loading: boolean;
}

function MemberForm<T extends z.ZodTypeAny>({
  formFields,
  onSubmit,
  initialValues,
  schema,
  loading,
}: IMemberForm<T>) {
  const router = useRouter();
  const params = useParams<{ member: string }>();
  const isAddMember = params.member === 'add';

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
  } = useForm<z.infer<T>>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
    mode: 'onChange', // Enable real-time validation
  });

  const updatePasswordField = (index: number) => {
    const newFields = [...fields];
    newFields[index].showPassword = !newFields[index].showPassword;
    setFields(newFields);
  };

  useEffect(() => {
    if (initialValues) {
      (Object.keys(initialValues) as Array<keyof z.infer<T>>).forEach((key) => {
        const path = key as Path<z.infer<T>>;
        const value = initialValues[key] as z.infer<T>[typeof key];
        setValue(path, value);
      });
    }
  }, [initialValues, setValue]);

  const [fields, setFields] =
    useState<IMemberFieldConfig<z.infer<T>>[]>(formFields);

  function cancel() {
    if (isAddMember) {
      router.push(RouteEnum.TEAM);
    } else {
      router.push(RouteEnum.TEAM + '/' + params.member);
    }
  }

  // Determine if submit button should be disabled
  const isSubmitDisabled = loading || !isValid || (!isDirty && isAddMember);

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-lg font-semibold">
        {isAddMember ? 'Add New' : 'Edit'} Team Member
      </h1>
      <p className="text-gray-600 text-sm">
        {isAddMember
          ? 'Please fill in details of new team member.'
          : 'Please update details to edit team member.'}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {fields.map(
            (
              {
                name,
                placeholder,
                type,
                label,
                showPassword,
                options,
                tooltip,
              },
              index,
            ) => (
              <div key={String(name)}>
                <label
                  className="relative flex mb-2 text-sm font-medium text-gray-900"
                  htmlFor={String(name)}
                >
                  {label}
                  {tooltip && (
                    <div className="flex items-center ml-1">
                      <Tooltip
                        content={tooltip}
                        className="py-1 px-2 max-w-sm text-xs font-normal text-white bg-gray-900 rounded-sm shadow-sm tooltip"
                      >
                        <ShowInfoIcon />
                      </Tooltip>
                    </div>
                  )}
                </label>
                <Controller
                  name={name as Path<z.infer<T>>}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      {type === 'select' ? (
                        <select
                          {...field}
                          id={String(name)}
                          className="appearance-none block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 capitalize"
                        >
                          <option value="" disabled hidden>
                            Select
                          </option>
                          {options?.map((option) => (
                            <option
                              key={option.id ?? option.value}
                              value={option.id ?? option.value}
                              id={
                                String(name) +
                                '_' +
                                String(option.id ?? option.value)
                              }
                            >
                              {option.name}
                            </option>
                          ))}
                        </select>
                      ) : type === 'password' ? (
                        <div className="relative">
                          <input
                            {...field}
                            id={String(name)}
                            type={showPassword ? 'text' : 'password'}
                            className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
                            placeholder={placeholder}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => updatePasswordField(index)}
                          >
                            {showPassword ? (
                              <EyeIcon aria-hidden="true" className="h-4 w-4" />
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
                          {...field}
                          id={String(name)}
                          type={type}
                          className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
                          placeholder={placeholder}
                        />
                      )}
                      {error && (
                        <p className="mt-1 text-red-500 text-sm">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            ),
          )}
        </div>
        <button
          id="submit"
          type="submit"
          className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 mt-6 inline-flex items-center gap-x-2 ${
            isSubmitDisabled
              ? 'bg-primary-800 cursor-not-allowed opacity-60'
              : 'bg-primary-700 hover:bg-primary-800'
          }`}
          disabled={isSubmitDisabled}
        >
          {isAddMember ? 'Add' : 'Edit'} Member {loading ? <Loader /> : ''}
        </button>
        <button
          id="cancel"
          type="button"
          className={`rounded-md bg-white px-3.5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-primary-700 ml-2 ${
            loading ? 'cursor-not-allowed' : ''
          }`}
          disabled={loading}
          onClick={cancel}
        >
          Cancel
        </button>
      </form>
    </section>
  );
}

export default MemberForm;
