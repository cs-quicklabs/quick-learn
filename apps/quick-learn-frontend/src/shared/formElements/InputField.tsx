import React, { FC } from 'react';
import { FieldType } from '../types/formTypes';

interface Props {
  label?: string;
  name: string;
  type?: FieldType;
  className?: string;
  register: any;
  errorMsg: string;
}
const InputField: FC<Props> = ({
  label,
  name,
  type = 'text',
  register,
  errorMsg,
  className = 'bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
}) => {
  if (type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <button
          id={name}
          aria-describedby="remember"
          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
          {...register(name)}
        />
        <div className="ml-3 text-sm">
          <label htmlFor={name} className="text-gray-500 dark:text-gray-300">
            {label}
          </label>
        </div>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      </div>
    );
  }
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`${className}${errorMsg ? 'border-red-500' : ''}`}
      />
      {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
};

export default InputField;
