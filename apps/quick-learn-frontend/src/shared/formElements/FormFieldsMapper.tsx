import React from 'react';
import InputField from './InputField';
import { Path, useForm, UseFormReset, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, z } from 'zod';
import { FieldConfig } from '../types/formTypes';
import ImageInput from './ImageInput';
import { Loader } from '../components/UIElements';
import { en } from '@src/constants/lang/en';

interface Props<T extends z.ZodTypeAny> {
  readonly fields: FieldConfig[];
  readonly schema: T;
  readonly onSubmit: (
    data: z.infer<T>,
    reset?: UseFormReset<TypeOf<T>>,
  ) => void;
  readonly buttonDisabled?: boolean;
  readonly buttonText?: string;
  readonly bigButton?: boolean;
  readonly methods?: UseFormReturn<z.TypeOf<T>>;
  readonly isLoading?: boolean;
  readonly resetFormOnSubmit?: boolean;
  readonly mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  readonly id?: string;
  readonly cancelButton?: () => void;
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
  mode = 'onBlur',
  id,
  cancelButton,
}: Props<T>) {
  // Call useForm unconditionally
  const defaultMethods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode,
  });

  // Use methods if provided, otherwise fall back to defaultMethods
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors, isValid, isDirty },
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
              imageType={field?.image_type ?? 'misc'}
              label={field.label}
            />
          );
        return (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder ?? ''}
            options={field.options}
            height={field.height}
            width={field.width}
            className={field.className}
            register={register}
            disabled={isLoading || field.disabled}
            errorMsg={errors[field.name]?.message as string}
            id={id}
          />
        );
      })}
      <div className="flex flex-wrap mt-4 gap-2">
        <button
          type="submit"
          disabled={buttonDisabled || isLoading || !isValid || !isDirty}
          className={`${
            bigButton && 'w-full'
          } text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center align-middle disabled:bg-gray-500`}
        >
          {isLoading ? <Loader /> : buttonText}
        </button>
        {cancelButton && (
          <button
            className={`${
              bigButton && 'w-full'
            } py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
            onClick={() => cancelButton()}
            type="button"
            disabled={isLoading}
          >
            {en.common.cancel}
          </button>
        )}
      </div>
    </form>
  );
}

export default FormFieldsMapper;
