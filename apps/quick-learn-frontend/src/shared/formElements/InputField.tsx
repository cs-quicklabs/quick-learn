import React, { FC, useEffect, useState } from 'react';
import { FieldType } from '../types/formTypes';
import { OpenEyeIcon, ClosedEyeIcon } from '../components/UIElements';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { RouteEnum } from '@src/constants/route.enum';
import { SuperLink } from '@src/utils/HiLink';

interface Props {
  label?: string;
  name: string;
  sub_label?: string;
  type?: FieldType;
  className?: string;
  register: UseFormRegister<FieldValues>;
  errorMsg: string;
  placeholder: string;
  disabled?: boolean;
  id?: string;
  options?: { value: string | number; label: string }[];
  height?: string;
  width?: string;
  resetState?: boolean;
}
const InputField: FC<Props> = ({
  label,
  name,
  sub_label,
  type = 'text',
  register,
  placeholder,
  errorMsg,
  disabled = false,
  className = 'bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5',
  id,
  options,
  height,
  width,
  resetState = false,
}) => {
  const isFieldPassword = type === 'password';
  const [showPassword, setShowPassword] = useState<boolean>(!isFieldPassword);

  useEffect(() => {
    if (isFieldPassword && resetState) {
      setShowPassword(false); // Reset to the "closed eye" state
    }
  }, [isFieldPassword, resetState]);
  if (type === 'checkbox') {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-start space-x-2">
          <input
            id={`${id ?? ''}_checkbox_${name}`}
            type={type}
            className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            {...register(name)}
          />
          <div className="ml-3 text-sm">
            <label
              htmlFor={`${id ?? ''}_checkbox_${name}`}
              className={
                sub_label ? 'font-medium text-gray-900' : 'text-gray-500'
              }
            >
              {label}
            </label>
            {sub_label && (
              <div className="text-xs font-normal text-gray-400">
                {sub_label}
              </div>
            )}
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        </div>
        {/* TODO: Remove this and make independent component for login */}
        {name === 'rememberMe' && (
          <SuperLink
            href={RouteEnum.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Forgot password?
          </SuperLink>
        )}
      </div>
    );
  }
  if (type === 'select') {
    return (
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor={`${id ?? ''}_select_${name}`}
        >
          {label}
        </label>
        <select
          id={`${id ?? ''}_select_${name}`}
          className={`${className} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
          {...register(name)}
          defaultValue=""
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
      </div>
    );
  }
  if (type === 'textarea') {
    return (
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor={`${id ?? ''}_textarea_${name}`}
        >
          {label}
        </label>
        <textarea
          id={`${id ?? ''}_textarea_${name}`}
          className={`${className} dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
          placeholder={placeholder}
          {...register(name)}
          style={{ height: `${height ?? 'auto'}`, width: `${width ?? 'auto'}` }}
        />
        {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
      </div>
    );
  }
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor={`${id ?? ''}_input_${
            showPassword ? 'text' : 'password' + name
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={`${id ?? ''}_input_${showPassword ? 'text' : 'password' + name}`}
          type={showPassword ? 'text' : 'password'}
          className={`${className} pr-10 ${
            errorMsg ? 'border-red-500' : ''
          } disabled:bg-gray-200`}
          placeholder={placeholder}
          autoComplete="true"
          disabled={disabled}
          {...register(name)}
        />
        {isFieldPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <ClosedEyeIcon /> : <OpenEyeIcon />}
          </button>
        )}
      </div>
      {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
};

export default InputField;
