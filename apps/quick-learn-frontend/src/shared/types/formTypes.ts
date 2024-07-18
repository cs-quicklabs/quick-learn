export type FieldType = 'text' | 'email' | 'password' | 'number';

export interface FieldConfig {
  label: string;
  name: string;
  type: FieldType;
}
