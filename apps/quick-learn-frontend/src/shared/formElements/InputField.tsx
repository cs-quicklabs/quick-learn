import React, { FC, useEffect, useState } from 'react';
import { FieldType } from '../types/formTypes';
import { OpenEyeIcon, ClosedEyeIcon } from '../components/UIElements';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { RouteEnum } from '@src/constants/route.enum';
import { SuperLink } from '@src/utils/HiLink';
import InputCheckbox from '../components/InputCheckbox';

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
  className = 'bg-gray-50 border focus:outline-hidden border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600  focus:ring-1 focus:border-primary-600 block w-full p-2.5',
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
        <div className="flex items-center">
          <div className="group grid size-4 grid-cols-1">
            <InputCheckbox
              id={`${id ?? ''}_checkbox_${name}`}
              type={type}
              {...register(name)}
            />
          </div>
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
          className="block mb-2 text-sm font-medium text-gray-900 focus:outline-none"
          htmlFor={`${id ?? ''}_select_${name}`}
        >
          {label}
        </label>
        <select
          id={`${id ?? ''}_select_${name}`}
          className={`${className} focus:outline-none`}
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
          className="block mb-2 text-sm font-medium text-gray-900 "
          htmlFor={`${id ?? ''}_textarea_${name}`}
        >
          {label}
        </label>
        <textarea
          id={`${id ?? ''}_textarea_${name}`}
          className={`${className} focus:outline-hidden`}
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
          className="block mb-2 text-sm font-medium text-gray-900 "
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
          className={`${className} pr-10  focus:outline-hidden ${
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
