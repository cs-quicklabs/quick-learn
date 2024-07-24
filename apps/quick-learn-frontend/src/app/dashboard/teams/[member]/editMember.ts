import { z } from "zod";
import { editMemberFormSchema } from "./formSchema";
import { IMemberFieldConfig } from "./MemberForm";

export type EditMemberFormData = z.infer<typeof editMemberFormSchema>;
export const editMemberFormInitialValues: EditMemberFormData = {
  first_name: '',
  last_name: '',
  email: '',
  user_type_id: '',
  skill_id: '',
  active: ''
}

export const editMemberFields: IMemberFieldConfig<EditMemberFormData>[] = [
  {
    label: 'First Name',
    name: 'first_name',
    type: 'text',
    placeholder: 'John',
  },
  {
    label: 'Last Name',
    name: 'last_name',
    type: 'text',
    placeholder: 'Doe',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'john.doe@gmail.com',
  },
  {
    label: 'User Role',
    name: 'user_type_id',
    type: 'select',
    tooltip:
      'A team member can be either Super Admin, Admin, Editor or Member',
  },
  {
    label: 'Active',
    name: 'active',
    type: 'select',
    tooltip:
      'Mark member as active or inactive',
    options: [
      { name: 'Active', value: 'true' },
      { name: 'Inactive', value: 'false' }
    ]
  },
  {
    label: 'Primary Skill',
    name: 'skill_id',
    type: 'select',
  },
];
