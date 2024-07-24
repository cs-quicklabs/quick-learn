export type FieldType = 'text' | 'email' | 'password' | 'checkbox';

export interface FieldConfig {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
}

export interface IMemberFieldConfig<T> {
  label: string;
  name: keyof T;
  type: 'text' | 'email' | 'password' | 'select';
  placeholder?: string;
  showPassword?: boolean;
  tooltip?: string;
}
