export type FieldType = 'text' | 'email' | 'password' | 'checkbox';

export interface FieldConfig {
  label: string;
  name: string;
  type: FieldType;
}
