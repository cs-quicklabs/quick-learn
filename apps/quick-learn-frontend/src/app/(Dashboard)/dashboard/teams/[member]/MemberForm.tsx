import { TypeOf, z } from 'zod';
import { useForm, Controller, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { RouteEnum } from '@src/constants/route.enum';
import { useRouter } from 'next/navigation';
import { Loader } from '@src/shared/components/UIElements';

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
  formFields: IMemberFieldConfig<z.infer<T>>[];
  onSubmit: (data: z.infer<T>) => void;
  initialValues: z.infer<T>;
  isAddForm: boolean;
  schema: T;
  loading: boolean;
}

function MemberForm<T extends z.ZodTypeAny>({
  formFields,
  onSubmit,
  initialValues,
  isAddForm,
  schema,
  loading,
}: IMemberForm<T>) {
  const router = useRouter();
  const { control, handleSubmit, setValue } = useForm<z.infer<T>>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
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
    router.push(RouteEnum.TEAM);
  }

  return (
    <section className="mt-2 lg:mt-6 mx-auto max-w-2xl">
      <h1 className="text-lg font-semibold">
        {isAddForm ? 'Add New' : 'Edit'} Team Member
      </h1>
      <p className="text-gray-600 text-sm">
        {isAddForm
          ? 'Please fill in details of new team member.'
          : 'Please update details to edit team member.'}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {fields.map(
            (
              { name, placeholder, type, label, showPassword, options },
              index,
            ) => (
              <div key={String(name)}>
                <label
                  className="relative flex mb-2 text-sm font-medium text-gray-900"
                  htmlFor={String(name)}
                >
                  {label}
                  {/* TODO: Need to add tooltip */}
                </label>
                <Controller
                  name={name as Path<TypeOf<T>>}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      {type === 'select' ? (
                        <select
                          {...field}
                          id={String(name)}
                          className="appearance-none block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {options?.map((option) => (
                            <option
                              key={option.id || option.value}
                              value={option.id || option.value}
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
          className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6 inline-flex items-center gap-x-2 ${
            loading ? ' bg-indigo-500 cursor-not-allowed' : ' bg-indigo-600'
          }`}
          disabled={loading}
        >
          {isAddForm ? 'Add' : 'Edit'} Member {loading ? <Loader /> : ''}
        </button>
        <button
          id="cancel"
          type="button"
          className={`rounded-md bg-white px-3.5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-2 ${
            loading ? ' cursor-not-allowed' : ''
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
