import React, { FC, useState } from 'react';
import { FieldType } from '../types/formTypes';
import { OpenEyeIcon, ClosedEyeIcon } from '../components/formUIElements';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface Props {
  label?: string;
  name: string;
  type?: FieldType;
  className?: string;
  register: UseFormRegister<FieldValues>;
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
  const isFieldPassword = type === 'password';
  const [showPassword, setShowPassword] = useState<boolean>(!isFieldPassword);
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
          autoComplete="true"
          {...register(name)}
        />
        {isFieldPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <OpenEyeIcon /> : <ClosedEyeIcon />}
          </button>
        )}
      </div>
      {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
};

export default InputField;
