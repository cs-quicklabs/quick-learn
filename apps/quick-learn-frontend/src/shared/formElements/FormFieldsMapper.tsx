import React from 'react';
import InputField from './InputField';
import { FormProvider, Path, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, z } from 'zod';
import { FieldConfig } from '../types/formTypes';
import ImageInput from './ImageInput';

interface Props<T extends z.ZodTypeAny> {
  fields: FieldConfig[];
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  buttonDisabled?: boolean;
  buttonText?: string;
  bigButton?: boolean;
  methods?: UseFormReturn<z.TypeOf<T>>;
}

//helper component to map form fields as per fields object
function FormFieldsMapper<T extends z.ZodTypeAny>({
  fields,
  schema,
  onSubmit,
  buttonText = 'Submit',
  buttonDisabled = false,
  bigButton = false,
  methods,
}: Props<T>) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods ||
  useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {fields.map((field) => {
        if (field.type === 'image')
          return (
            <ImageInput
              key={field.label}
              watch={watch}
              setValue={setValue}
              name={field.name}
              src={
                getValues(
                  field.name as unknown as readonly Path<TypeOf<T>>[],
                ) as unknown as string
              }
              label={field.label}
            />
          );
        return (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder || ''}
            register={register}
            errorMsg={errors[field.name]?.message as string}
          />
        );
      })}
      <button
        type="submit"
        disabled={buttonDisabled}
        className={`${
          bigButton && 'w-full'
        } mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
      >
        {buttonText}
      </button>
    </form>
  );
}

export default FormFieldsMapper;
