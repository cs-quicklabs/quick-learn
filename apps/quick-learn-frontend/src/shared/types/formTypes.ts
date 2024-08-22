import { FilePathType } from 'lib/shared/src';

export type FieldType = 'text' | 'email' | 'password' | 'checkbox' | 'image';

export interface FieldConfig {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  image_type?: FilePathType;
}
