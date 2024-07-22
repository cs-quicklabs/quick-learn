import React, { FC, useState } from 'react';
import { FieldType } from '../types/formTypes';

interface Props {
  label?: string;
  name: string;
  type?: FieldType;
  className?: string;
  register: any;
  errorMsg: string;
  placeholder: string;
}
const InputField: FC<Props> = ({
  label,
  name,
  type = 'text',
  register,
  placeholder,
  errorMsg,
  className = 'bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  if (type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <input
          id={name}
          type={type}
          className="form-checkbox h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
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
      <div className="relative">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          className={`${className} pr-10 ${errorMsg ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          {...register(name)}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              //open eye icon
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              //closed eye icon
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
};

export default InputField;
