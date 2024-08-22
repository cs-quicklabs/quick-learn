import React from 'react';
import InputField from './InputField';
import { Path, useForm, UseFormReset, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, z } from 'zod';
import { FieldConfig } from '../types/formTypes';
import ImageInput from './ImageInput';
import { Loader } from '../components/UIElements';

interface Props<T extends z.ZodTypeAny> {
  fields: FieldConfig[];
  schema: T;
  onSubmit: (data: z.infer<T>, reset?: UseFormReset<TypeOf<T>>) => void;
  buttonDisabled?: boolean;
  buttonText?: string;
  bigButton?: boolean;
  methods?: UseFormReturn<z.TypeOf<T>>;
  isLoading?: boolean;
  resetFormOnSubmit?: boolean;
}

function FormFieldsMapper<T extends z.ZodTypeAny>({
  fields,
  schema,
  onSubmit,
  buttonText = 'Submit',
  buttonDisabled = false,
  bigButton = false,
  isLoading = false,
  methods,
  resetFormOnSubmit = false,
}: Props<T>) {
  // Call useForm unconditionally
  const defaultMethods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  // Use methods if provided, otherwise fall back to defaultMethods
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors, isValid },
  } = methods || defaultMethods;

  const handleFormSubmit = (data: z.infer<T>) => {
    onSubmit(data, reset);
    if (resetFormOnSubmit) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      noValidate
    >
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
              imageType={field?.image_type || 'misc'}
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
            disabled={isLoading}
            errorMsg={errors[field.name]?.message as string}
          />
        );
      })}
      <button
        type="submit"
        disabled={buttonDisabled || isLoading || !isValid}
        className={`${
          bigButton && 'w-full'
        } mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center align-middle disabled:bg-gray-500`}
      >
        {isLoading ? <Loader /> : buttonText}
      </button>
    </form>
  );
}

export default FormFieldsMapper;
