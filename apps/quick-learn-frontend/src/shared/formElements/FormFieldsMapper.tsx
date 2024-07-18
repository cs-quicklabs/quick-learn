import React, { FC } from 'react';
import InputField from './InputField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldConfig } from '../types/formTypes';
import { z } from 'zod';

interface Props<T extends z.ZodType<any, any>> {
  fields: FieldConfig[];
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
}

//helper component to map form fields as per fields object
function FormFieldsMapper<T extends z.ZodType<any, any>>({
  fields,
  schema,
  onSubmit,
}: Props<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          register={register}
          errorMsg={errors[field.name]?.message as string}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default FormFieldsMapper;
