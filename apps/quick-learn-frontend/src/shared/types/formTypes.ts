import { FilePathType } from 'lib/shared/src';
import { ReactNode } from 'react';

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
  customPreview?: ReactNode; // Add custom preview for any field (especially useful for images)
}
