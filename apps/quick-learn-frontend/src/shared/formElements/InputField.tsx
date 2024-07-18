import React, { FC } from 'react';
import { FieldType } from '../types/formTypes';

interface Props {
  label: string;
  name: string;
  type?: FieldType;
  register: any;
  errorMsg: string;
}
const InputField: FC<Props> = ({
  label,
  name,
  type = 'text',
  register,
  errorMsg,
}) => (
  <div className="mb-4">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      {...register(name)}
      className={`mt-1 ${errorMsg ? 'border-red-500' : ''}`}
    />
    {errorMsg && <p className="mt-1 text-red-500 text-sm">{errorMsg}</p>}
  </div>
);

export default InputField;
