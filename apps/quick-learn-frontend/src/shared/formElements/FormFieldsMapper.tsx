import React from 'react';
import InputField from './InputField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldConfig } from '../types/formTypes';

interface Props<T extends z.ZodTypeAny> {
  fields: FieldConfig[];
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  buttonDisabled?: boolean;
  buttonText?: string;
}

//helper component to map form fields as per fields object
function FormFieldsMapper<T extends z.ZodTypeAny>({
  fields,
  schema,
  onSubmit,
  buttonText = 'Submit',
  buttonDisabled = false,
}: Props<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder || ''}
          register={register}
          errorMsg={errors[field.name]?.message as string}
        />
      ))}
      <button
        type="submit"
        disabled={buttonDisabled}
        className="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-slate-500"
      >
        {buttonText}
      </button>
    </form>
  );
}

export default FormFieldsMapper;
