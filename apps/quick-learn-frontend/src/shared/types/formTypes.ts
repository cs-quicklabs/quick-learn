import { FilePathType } from 'lib/shared/src';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'image'
  | 'select'
  | 'textarea';

export interface FieldConfig {
  label: string;
  sub_label?: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  image_type?: FilePathType;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  className?: string;
  height?: string;
  width?: string;
  firstName?: string;
  lastName?: string;
}
