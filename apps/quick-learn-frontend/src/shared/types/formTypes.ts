export type FieldType = 'text' | 'email' | 'password' | 'checkbox' | 'image';

export interface FieldConfig {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
}
